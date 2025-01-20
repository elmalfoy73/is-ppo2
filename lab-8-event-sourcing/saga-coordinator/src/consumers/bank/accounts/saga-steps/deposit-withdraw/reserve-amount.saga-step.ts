import { SagaStepInterface } from "../saga-step.interface";
import { KafkaMessagesDto } from "../../../../../clients/kafka/dto/kafka.messages.dto";
import { Consumer } from "../../../../consumer.interface";
import {
   isKafkaPayloadOfUpdateBankAccountDto
} from "../../../../../utils/static/is-kafka-payload-dto.util";
import { KafkaEvent } from "../../../../../clients/kafka/enums/kafka.event";
import { KafkaEventsService } from "../../../../../models/kafka-events/kafka.events.service";
import { KafkaTopic } from "../../../../../clients/kafka/enums/kafka.topic";
import { v4 as uuidv4 } from 'uuid';
import { UpdateBankAccountSagaSubeventEnum } from "../enum/update-bank-account.saga.subevent.enum";
import { Injectable } from "@nestjs/common";
import { FailFullSagaSagaStep } from "./fail-full-saga.saga-step";
import { CreateDepositWithdrawTransactionSagaStep } from "./create-deposit-withdraw-transaction.saga-step";

@Injectable()
export class ReserveAmountSagaStep extends Consumer implements SagaStepInterface {
  private readonly subEvent = UpdateBankAccountSagaSubeventEnum.MONEY_RESERVE;

  readonly name = ReserveAmountSagaStep.name;
  readonly onSuccess: SagaStepInterface = null;
  readonly onFailure: SagaStepInterface = null;

  constructor(
    protected readonly kafkaEventsService: KafkaEventsService,
    private readonly failFullSagaStep: FailFullSagaSagaStep,
    private readonly createTransactionSagaStep: CreateDepositWithdrawTransactionSagaStep,
  ) {
    super(kafkaEventsService, KafkaTopic.BANK_ACCOUNT);
    this.onSuccess = createTransactionSagaStep;
    this.onFailure = failFullSagaStep;
  }

  async handle(payload: unknown): Promise<void | KafkaMessagesDto<unknown>> {
    if (!isKafkaPayloadOfUpdateBankAccountDto(payload)) {
      throw new Error('Error reserving amount: payload is not assignable to UpdateBankAccountDto.')
    }

    const newRequestId = uuidv4();

    return this.buildProducedMessage(
      newRequestId,
      KafkaEvent.UPDATE,
      {
        id: payload.message.id,
        reservedAmount: payload.message.amount,
        subEvent: this.subEvent,
      },
      payload.requestId
    );
  }

  async consume(): Promise<void | KafkaMessagesDto<unknown>> {}
}