import { Injectable } from '@nestjs/common';
import { Consumer } from '../../consumer.interface';
import {
  KafkaMessagesDto,
  KafkaPayloadDto,
} from '../../../clients/kafka/dto/kafka.messages.dto';
import { KafkaEvent } from '../../../clients/kafka/enums/kafka.event';
import { KafkaTopic } from '../../../clients/kafka/enums/kafka.topic';
import { KafkaEventsService } from '../../../models/kafka-events/kafka.events.service';
import { BankAccountsService } from '../../../models/bank-accounts/bank-accounts.service';
import {
  isKafkaPayloadOfUpdateBankAccountDto,
  isKafkaPayloadOfUpdateBankAccountResponseDto,
} from '../../../utils/static/is-kafka-payload-dto.util';
import { UpdateBankAccountDto } from '../../../dto/update-bank-account.dto';
import { SagaStepInterface } from './saga-steps/saga-step.interface';
import { ReserveAmountSagaStep } from './saga-steps/deposit-withdraw/reserve-amount.saga-step';
import { BankAccountsModel } from '../../../models/bank-accounts/bank-accounts.model';
import { KafkaEventStatus } from '../../../clients/kafka/enums/kafka-event.status';
import { SagaFallbackService } from '../../../models/saga-fallback/saga.fallback.service';
import { SagaFallbackDto } from '../../../models/saga-fallback/dto/saga.fallback.dto';
import { CreateDepositWithdrawTransactionSagaStep } from './saga-steps/deposit-withdraw/create-deposit-withdraw-transaction.saga-step';
import { UpdateBankAccountPurposeEnum } from '../../../enums/update-bank-account.purpose.enum';
import { InitiateTransferMoneySagaStep } from './saga-steps/deposit-withdraw/initiate-transfer-money.saga-step';
import { CreateTransferTransactionSagaStep } from "./saga-steps/deposit-withdraw/create-transfer-transaction.saga-step";

@Injectable()
export class BankAccountsConsumer extends Consumer {
  private readonly sagaTopic: KafkaTopic = KafkaTopic.SAGA_BANK_ACCOUNT;

  private readonly processingRequestIds = new Set<string>();

  private initialStates: Array<{
    requestId: string;
    states: BankAccountsModel[];
  }> = [];

  private executedSteps: Array<{
    requestId: string;
    stepNames: Set<string>;
  }> = [];

  constructor(
    protected readonly kafkaEventsService: KafkaEventsService,
    private readonly sagaFallbackService: SagaFallbackService,
    private readonly bankAccountsService: BankAccountsService,

    private readonly reserveAmountSagaStep: ReserveAmountSagaStep,
    private readonly createDepositOrWithdrawTransactionSagaStep: CreateDepositWithdrawTransactionSagaStep,
    private readonly createTransferTransactionSagaStep: CreateTransferTransactionSagaStep,
    private readonly initiateTransferMoneySagaStep: InitiateTransferMoneySagaStep,
  ) {
    super(kafkaEventsService, KafkaTopic.BANK_ACCOUNT);
  }

  consume(
    topic: KafkaTopic,
    payload: KafkaPayloadDto<unknown>,
  ): Promise<void | KafkaMessagesDto<unknown>> {
    switch (topic) {
      case KafkaTopic.SAGA_BANK_ACCOUNT: {
        if (!isKafkaPayloadOfUpdateBankAccountDto(payload)) {
          return this.failEvent(
            topic,
            payload,
            payload.message,
            'Received payload is not assignable to UpdateBankAccountDto',
          );
        }

        return this.handleSagaTopicEvent(payload);
      }

      case KafkaTopic.BANK_ACCOUNT: {
        if (
          payload.event === KafkaEvent.UPDATE_SUCCESS &&
          !isKafkaPayloadOfUpdateBankAccountResponseDto(payload)
        ) {
          return this.failEvent(
            this.sagaTopic,
            { ...payload, requestId: payload.requesterId },
            'undefined',
            'Received payload is not assignable to UpdateBankAccountDto',
          );
        }

        return this.handleBankAccountTopicEvent(payload);
      }

      case KafkaTopic.TRANSACTION: {
        return this.handleTransactionTopicEvent(payload);
      }
    }
  }

  async onModuleInit() {
    await this.restoreState();
  }

  private async handleSagaTopicEvent(
    payload: KafkaPayloadDto<UpdateBankAccountDto>,
  ) {
    await this.kafkaEventsService.awaitUpdateOrCreateKafkaEvent({
      id: payload.requestId,
      requesterId: payload.requesterId,
      eventTopic: this.sagaTopic,
      event: payload.event,
      eventStatus: KafkaEventStatus.PROCESSING,
      eventPayload: payload.message,
    });

    switch (payload.event) {
      case KafkaEvent.UPDATE: {
        // got initial message
        await this.handleInitialMessage(payload);
        await this.saveState();
        break;
      }
    }

    const initialStateObject = this.initialStates.find(
      (state) =>
        state.requestId === payload.requestId ||
        state.requestId === payload.requesterId,
    );

    if (!initialStateObject?.states) {
      if (!this.processingRequestIds.has(payload.requesterId)) {
        // Processing done
        return;
      }

      await this.handleRequestIdProcessingDone(
        initialStateObject.requestId,
        false,
      );

      return this.failEvent(
        this.sagaTopic,
        payload,
        payload.message,
        `Failed to get initial state to update. ASAP, requested id ${payload.message.id} doensn't exist`,
      );
    }

    switch (payload.event) {
      case KafkaEvent.UPDATE_FAIL:
      case KafkaEvent.CREATE_FAIL: {
        await this.handleRequestIdProcessingDone(
          initialStateObject.requestId,
          false,
        );


        return;
      }
    }

    return this.proceedSaga(initialStateObject, payload);
  }

  private async handleBankAccountTopicEvent(payload: KafkaPayloadDto<unknown>) {
    if (payload.event === KafkaEvent.UPDATE) {
      return;
    }

    const initialStateObject = this.initialStates.find(
      (state) =>
        state.requestId === payload.requestId ||
        state.requestId === payload.requesterId,
    );

    if (!initialStateObject?.states) {
      if (!this.processingRequestIds.has(payload.requesterId)) {
        // Processing done
        return;
      }

      await this.handleRequestIdProcessingDone(
        initialStateObject.requestId,
        false,
      );


        return this.failEvent(
          this.sagaTopic,
          { ...payload, requestId: payload.requesterId, requesterId: null },
          payload.message,
          `Failed to get initial state to update.`,
        );
    }

    switch (payload.event) {
      case KafkaEvent.UPDATE_FAIL:
      case KafkaEvent.CREATE_FAIL: {
        await this.handleRequestIdProcessingDone(
          initialStateObject.requestId,
          false,
        );
        return this.failEvent(this.sagaTopic, { ...payload, requestId: initialStateObject.requestId, requesterId: null }, payload.message, '')
      }
    }

    console.log(JSON.stringify(payload))

    return this.proceedSaga(initialStateObject, {
      ...payload,
      requestId: payload.requesterId,
      requesterId: null,
    });
  }

  private async handleTransactionTopicEvent(payload: KafkaPayloadDto<any>) {
    if (payload.event === KafkaEvent.CREATE) {
      return;
    }

    const initialStateObject = this.initialStates.find(
      (state) =>
        state.requestId === payload.requestId ||
        state.requestId === payload.requesterId,
    );

    if (!initialStateObject?.states) {
      if (!this.processingRequestIds.has(payload.requesterId)) {
        // Processing done
        return;
      }

      await this.handleRequestIdProcessingDone(
        initialStateObject.requestId,
        false,
      );

      return this.failEvent(
        this.sagaTopic,
        { ...payload, requestId: payload.requesterId, requesterId: null },
        payload.message,
        `Failed to get initial state to update.`,
      );
    }

    switch (payload.event) {
      case KafkaEvent.UPDATE_FAIL:
      case KafkaEvent.CREATE_FAIL: {
        await this.handleRequestIdProcessingDone(
          initialStateObject.requestId,
          false,
        );
        return this.failEvent(this.sagaTopic, { ...payload, requestId: initialStateObject.requestId, requesterId: null }, payload.message, '')
      }
    }

    return this.proceedSaga(initialStateObject, {
      ...payload,
      requestId: payload.requesterId,
      requesterId: null,
    });
  }

  private async proceedSaga(
    initialStateObject: { requestId: string; states: BankAccountsModel[] },
    payload: KafkaPayloadDto<UpdateBankAccountDto>,
  ) {
    const step = await this.defineStep(initialStateObject.requestId, payload);

    if (!step) {
      // nothing to do else
      const updatedEntities = initialStateObject.states.map((state) => {
        return this.bankAccountsService.getById(state.id);
      });

      await this.kafkaEventsService.awaitUpdateOrCreateKafkaEvent({
        id: initialStateObject.requestId,
        requesterId: payload.requesterId,
        eventTopic: this.sagaTopic,
        event: payload.event,
        eventStatus: KafkaEventStatus.SUCCEEDED,
        eventPayload: await Promise.all(updatedEntities),
      });

      await this.handleRequestIdProcessingDone(
        initialStateObject.requestId,
        true,
      );

      return this.buildSuccessMessage(
        initialStateObject.requestId,
        KafkaEvent.CREATE_SUCCESS,
        {
          payload: await Promise.all(updatedEntities),
          requestId: payload.requestId,
        },
        null,
      );
    }

    const builtPayload = await this.executeStep(
      initialStateObject.states,
      initialStateObject.requestId,
      payload,
      step,
    );

    const handledResult = await this.handleStepResult(
      this.sagaTopic,
      initialStateObject.requestId,
      initialStateObject.states,
      payload,
      builtPayload,
    );

    return handledResult;
  }

  private async defineStep(
    requestId: string,
    payload: KafkaPayloadDto<UpdateBankAccountDto>,
  ) {
    const processedSteps = this.executedSteps.find(
      (step) => step.requestId === requestId,
    );

    if (!(processedSteps?.stepNames?.size > 0)) {
      return this.defineInitialStep(payload);
    }

    let nextStep: SagaStepInterface;

    if (processedSteps.stepNames.has(ReserveAmountSagaStep.name)) {
      nextStep =
        payload.event === KafkaEvent.CREATE_SUCCESS ||
        payload.event === KafkaEvent.UPDATE_SUCCESS
          ? this.reserveAmountSagaStep.onSuccess
          : this.reserveAmountSagaStep.onFailure;
    }

    if (
      processedSteps.stepNames.has(
        CreateDepositWithdrawTransactionSagaStep.name,
      )
    ) {
      nextStep =
        payload.event === KafkaEvent.CREATE_SUCCESS ||
        payload.event === KafkaEvent.UPDATE_SUCCESS
          ? this.createDepositOrWithdrawTransactionSagaStep.onSuccess
          : this.createDepositOrWithdrawTransactionSagaStep.onFailure;
    }

    if (processedSteps.stepNames.has(InitiateTransferMoneySagaStep.name)) {
      nextStep =
        payload.event === KafkaEvent.CREATE_SUCCESS ||
        payload.event === KafkaEvent.UPDATE_SUCCESS
          ? this.initiateTransferMoneySagaStep.onSuccess
          : this.initiateTransferMoneySagaStep.onFailure;
    }

    if (processedSteps.stepNames.has(CreateTransferTransactionSagaStep.name)) {
      nextStep =         payload.event === KafkaEvent.CREATE_SUCCESS ||
      payload.event === KafkaEvent.UPDATE_SUCCESS
        ? this.createTransferTransactionSagaStep.onSuccess
        : this.createTransferTransactionSagaStep.onFailure;
    }

    return nextStep;
  }

  private async defineInitialStep(
    payload: KafkaPayloadDto<UpdateBankAccountDto>,
  ): Promise<SagaStepInterface> {
    switch (payload.message.purpose) {
      case UpdateBankAccountPurposeEnum.DEPOSIT:
      case UpdateBankAccountPurposeEnum.WITHDRAW: {
        return this.reserveAmountSagaStep;
      }

      case UpdateBankAccountPurposeEnum.TRANSFER: {
        return this.initiateTransferMoneySagaStep;
      }
    }
  }

  private async executeStep(
    initialStates: BankAccountsModel[],
    initialRequestId: string,
    payload: KafkaPayloadDto<unknown>,
    executor: SagaStepInterface,
  ) {
    let result: void | KafkaMessagesDto<unknown>;
    let errorMessage = '';

    try {
      result = await executor.handle(payload);
    } catch (error) {
      for (const state of initialStates) {
        await this.bankAccountsService.rollback(state);
      }
      await this.handleRequestIdProcessingDone(initialRequestId, false);
      errorMessage = error.message;
    }

    const foundRequestIndex = this.executedSteps.findIndex(
      (step) => step.requestId === initialRequestId,
    );

    if (foundRequestIndex !== -1) {
      this.executedSteps[foundRequestIndex].stepNames.add(executor.name);
    } else {
      this.executedSteps.push({
        requestId: initialRequestId,
        stepNames: new Set([executor.name]),
      });
    }

    return { result, errorMessage };
  }

  private async handleStepResult(
    topic: KafkaTopic,
    initialRequestId: string,
    initialStates: BankAccountsModel[],
    initialPayload: KafkaPayloadDto<UpdateBankAccountDto>,
    builtPayload: {
      result: void | KafkaMessagesDto<unknown>;
      errorMessage?: string;
    },
  ) {
    if (builtPayload.errorMessage) {
      for (const state of initialStates) {
        await this.bankAccountsService.rollback(state);
      }
      await this.handleRequestIdProcessingDone(initialRequestId, false);

      return this.failEvent(
        topic,
        initialPayload,
        initialPayload.message,
        `Saga step failed: ${builtPayload.errorMessage}`,
      );
    }

    return builtPayload.result;
  }

  private async handleInitialMessage(payload: KafkaPayloadDto<any>) {
    this.processingRequestIds.add(payload.requestId);
    this.executedSteps.push({
      requestId: payload.requestId,
      stepNames: new Set(),
    });

    switch (payload.message.subEvent ?? payload.message.purpose) {
      case UpdateBankAccountPurposeEnum.DEPOSIT:
      case UpdateBankAccountPurposeEnum.WITHDRAW: {
        this.initialStates.push({
          requestId: payload.requestId,
          states: [await this.bankAccountsService.getById(payload.message.id)],
        });

        break;
      }

      case UpdateBankAccountPurposeEnum.TRANSFER: {
        this.initialStates.push({
          requestId: payload.requestId,
          states: [
            await this.bankAccountsService.getById(payload.message.sourceId),
            await this.bankAccountsService.getById(
              payload.message.destinationId,
            ),
          ],
        });

        break;
      }
    }
  }

  private async handleRequestIdProcessingDone(
    requestId: string,
    isSucceeded: boolean,
  ): Promise<void> {
    console.log(true);

    const initialState = !isSucceeded
      ? this.initialStates.find(
          (state) => state.requestId.toString() === requestId.toString(),
        )
      : null;

    if (initialState && initialState?.states?.length > 0) {
      for (const state of initialState.states) {
        console.log(await this.bankAccountsService.rollback(state.dataValues));
      }
    }

    this.initialStates = this.initialStates.filter(
      (state) => state.requestId !== requestId,
    );
    this.executedSteps = this.executedSteps.filter(
      (step) => step.requestId !== requestId,
    );
    this.processingRequestIds.delete(requestId);

    await this.sagaFallbackService.removeByRequestId(requestId);
  }

  private async restoreState() {
    const statePayload = await this.sagaFallbackService.restore();

    for (const requestState of statePayload) {
      this.processingRequestIds.add(requestState.requestId);
      this.executedSteps.push({
        requestId: requestState.requestId,
        stepNames: new Set(requestState.executedStepsPayload),
      });
      this.initialStates.push({
        requestId: requestState.requestId,
        states: requestState.initialEntityState,
      });
    }
  }

  private async saveState() {
    const fallbackState = [...this.processingRequestIds].map(
      (requestId): SagaFallbackDto => {
        const executedSteps = this.executedSteps.find(
          (step) => step.requestId === requestId,
        );
        const executedStepsPayload = executedSteps
          ? [...executedSteps.stepNames]
          : [];

        const initialEntityState = this.initialStates.find(
          (initialState) => initialState.requestId === requestId,
        );

        return {
          requestId,
          executedStepsPayload,
          initialEntityState: initialEntityState?.states,
        };
      },
    );

    await Promise.all(
      fallbackState.map((state) => this.sagaFallbackService.saveState(state)),
    );
  }
}