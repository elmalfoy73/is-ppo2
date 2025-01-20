import { Injectable } from '@nestjs/common';
import { Consumer } from '../../../../consumer.interface';
import { SagaStepInterface } from '../saga-step.interface';
import { KafkaTopic } from '../../../../../clients/kafka/enums/kafka.topic';
import {
  KafkaMessagesDto,
  KafkaPayloadDto,
} from '../../../../../clients/kafka/dto/kafka.messages.dto';
import { KafkaEventsService } from '../../../../../models/kafka-events/kafka.events.service';

@Injectable()
export class FailFullSagaSagaStep
  extends Consumer
  implements SagaStepInterface
{
  readonly name: string = FailFullSagaSagaStep.name;

  constructor(protected readonly kafkaEventsService: KafkaEventsService) {
    super(kafkaEventsService, KafkaTopic.SAGA_BANK_ACCOUNT);
  }

  async consume(): Promise<void | KafkaMessagesDto<unknown>> {}

  async handle(
    payload: KafkaPayloadDto<unknown>,
  ): Promise<void | KafkaMessagesDto<unknown>> {
    console.log('ahndled', JSON.stringify(payload));

    return this.failEvent(
      this.topic,
      payload,
      payload.message,
      'Got event failure from last step.',
    );
  }
}