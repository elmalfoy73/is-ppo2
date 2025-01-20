import { SagaStepInterface } from '../saga-step.interface';
import { KafkaMessagesDto } from '../../../../../clients/kafka/dto/kafka.messages.dto';
import { Consumer } from '../../../../consumer.interface';
import { isKafkaPayloadOfUpdateBankAccountDto } from '../../../../../utils/static/is-kafka-payload-dto.util';
import { KafkaEvent } from '../../../../../clients/kafka/enums/kafka.event';
import { KafkaEventsService } from '../../../../../models/kafka-events/kafka.events.service';
import { KafkaTopic } from '../../../../../clients/kafka/enums/kafka.topic';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { FailFullSagaSagaStep } from './fail-full-saga.saga-step';
import { CreateTransactionPurposeSagaSubeventEnum } from '../enum/create-transaction-purpose.saga.subevent.enum';

@Injectable()
export class CreateDepositWithdrawTransactionSagaStep
  extends Consumer
  implements SagaStepInterface
{
  readonly name = CreateDepositWithdrawTransactionSagaStep.name;
  readonly onSuccess: SagaStepInterface = null;
  readonly onFailure: SagaStepInterface = null;

  constructor(
    protected readonly kafkaEventsService: KafkaEventsService,
    private readonly failFullSagaStep: FailFullSagaSagaStep,
  ) {
    super(kafkaEventsService, KafkaTopic.TRANSACTION);
    this.onFailure = failFullSagaStep;
  }

  async handle(payload: any): Promise<void | KafkaMessagesDto<unknown>> {
    const newRequestId = uuidv4();
    return this.buildProducedMessage(
      newRequestId,
      KafkaEvent.CREATE,
      {
        sourceId: payload.message.reservedAmount >= 0 ? null : payload.message.id,
        destinationId: payload.message.reservedAmount >= 0 ? payload.message.id : null,
        amount: Math.abs(payload.message.reservedAmount),
        purpose:
          payload.message.reservedAmount >= 0
            ? CreateTransactionPurposeSagaSubeventEnum.DEPOSIT
            : CreateTransactionPurposeSagaSubeventEnum.WITHDRAW,
      },
      payload.requestId,
    );
  }

  async consume(): Promise<void | KafkaMessagesDto<unknown>> {}
}