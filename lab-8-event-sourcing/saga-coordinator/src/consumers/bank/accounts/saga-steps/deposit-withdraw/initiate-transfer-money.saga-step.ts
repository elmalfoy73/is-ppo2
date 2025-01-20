import { Injectable } from "@nestjs/common";
import { Consumer } from "../../../../consumer.interface";
import { SagaStepInterface } from "../saga-step.interface";
import { UpdateBankAccountSagaSubeventEnum } from "../enum/update-bank-account.saga.subevent.enum";
import { KafkaEventsService } from "../../../../../models/kafka-events/kafka.events.service";
import { FailFullSagaSagaStep } from "./fail-full-saga.saga-step";
import { KafkaTopic } from "../../../../../clients/kafka/enums/kafka.topic";
import { KafkaMessagesDto } from "../../../../../clients/kafka/dto/kafka.messages.dto";
import { v4 as uuidv4 } from "uuid";
import { KafkaEvent } from "../../../../../clients/kafka/enums/kafka.event";
import { CreateTransferTransactionSagaStep } from "./create-transfer-transaction.saga-step";

@Injectable()
export class InitiateTransferMoneySagaStep extends Consumer implements SagaStepInterface {
  private readonly subEvent = UpdateBankAccountSagaSubeventEnum.MONEY_RESERVE;

  readonly name = InitiateTransferMoneySagaStep.name;
  readonly onSuccess: SagaStepInterface = null;
  readonly onFailure: SagaStepInterface = null;

  constructor(
    protected readonly kafkaEventsService: KafkaEventsService,
    private readonly failFullSagaStep: FailFullSagaSagaStep,
    private readonly createTransactionSagaStep: CreateTransferTransactionSagaStep,
  ) {
    super(kafkaEventsService, KafkaTopic.BANK_ACCOUNT);
    this.onSuccess = createTransactionSagaStep;
    this.onFailure = failFullSagaStep;
  }

  async handle(payload: any): Promise<void | KafkaMessagesDto<unknown>> {
    const newRequestId = uuidv4();

    console.log(JSON.stringify(payload));

    return this.buildProducedMessage(
      newRequestId,
      KafkaEvent.UPDATE,
      {
        sourceId: payload.message.sourceId,
        destinationId: payload.message.destinationId,
        reservedAmount: payload.message.amount,
        subEvent: UpdateBankAccountSagaSubeventEnum.MONEY_TRANSFER,
      },
      payload.requestId
    );
  }

  async consume(): Promise<void | KafkaMessagesDto<unknown>> {}
}