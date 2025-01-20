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
export class CreateTransferTransactionSagaStep
  extends Consumer
  implements SagaStepInterface
{
  readonly name = CreateTransferTransactionSagaStep.name;
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

    console.log('asdfda', JSON.stringify(payload));

    return this.buildProducedMessage(
      newRequestId,
      KafkaEvent.CREATE,
      {
        sourceId: payload.message.sourceId,
        destinationId: payload.message.destinationId,
        amount: payload.message.reservedAmount,
        purpose: CreateTransactionPurposeSagaSubeventEnum.TRANSFER,
      },
      payload.requestId,
    );
  }

  async consume(): Promise<void | KafkaMessagesDto<unknown>> {}
}