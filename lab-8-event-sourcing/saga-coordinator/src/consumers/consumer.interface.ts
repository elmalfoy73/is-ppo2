import {
  KafkaConsumerError,
  KafkaMessagesDto,
  KafkaPayloadDto,
} from '../clients/kafka/dto/kafka.messages.dto';
import { KafkaEvent } from '../clients/kafka/enums/kafka.event';
import { KafkaTopic } from '../clients/kafka/enums/kafka.topic';
import { KafkaEventStatus } from '../clients/kafka/enums/kafka-event.status';
import { KafkaEventsService } from '../models/kafka-events/kafka.events.service';
import { KafkaEventsModel } from '../models/kafka-events/kafka.events.model';

export abstract class Consumer {
  constructor(
    protected readonly kafkaEventsService: KafkaEventsService,
    protected readonly topic: KafkaTopic,
  ) {}

  abstract consume(
    topic: KafkaTopic,
    payload: KafkaPayloadDto<unknown>,
  ): Promise<void | KafkaMessagesDto<unknown>>;

  protected buildFailedMessage(
    consumedPayload: KafkaPayloadDto<unknown>,
    producedEvent: KafkaEvent,
    producedReason: string,
  ): KafkaMessagesDto<unknown> {
    const messagePayload: KafkaConsumerError = {
      consumedPayload: {
        requestId: consumedPayload.requestId,
      },
      producedReason,
    };

    return {
      topic: this.topic,
      payload: [
        {
          requestId: consumedPayload.requestId,
          event: producedEvent,
          message: messagePayload,
        },
      ],
    };
  }

  protected async buildProducedMessage(
    requestId: string,
    producedEvent: KafkaEvent,
    producedPayload: unknown,
    requesterId?: string,
  ): Promise<KafkaMessagesDto<unknown>> {
    await this.kafkaEventsService.createKafkaEvent({
      id: requestId,
      eventTopic: this.topic,
      event: producedEvent,
      eventStatus: KafkaEventStatus.INITIATED,
      eventPayload: producedPayload,
    });
    return {
      topic: this.topic,
      payload: [
        {
          requestId: requestId,
          requesterId: requesterId,
          event: producedEvent,
          message: producedPayload,
        },
      ],
    };
  }

  protected async failEvent(
    topic: KafkaTopic,
    payload: KafkaPayloadDto<unknown>,
    payloadMessage: unknown,
    errorMessage: string,
  ) {
    const basicKafkaEventObject = {
      id: payload.requestId,
      requesterId: payload.requesterId,
      eventTopic: topic,
      event: payload.event,
    };

    await this.kafkaEventsService.awaitUpdateOrCreateKafkaEvent({
      ...basicKafkaEventObject,
      eventStatus: KafkaEventStatus.FAILED,
      eventPayload: {
        payload: payloadMessage,
        error: errorMessage,
      },
    });

    switch (payload.event) {
      case KafkaEvent.CREATE: {
        return this.buildFailedMessage(
          payload,
          KafkaEvent.CREATE_FAIL,
          errorMessage,
        );
      }

      case KafkaEvent.CREATE_FAIL: {
        return this.buildFailedMessage(
          payload,
          KafkaEvent.CREATE_FAIL,
          errorMessage,
        );
      }

      case KafkaEvent.UPDATE: {
        return this.buildFailedMessage(
          payload,
          KafkaEvent.UPDATE_FAIL,
          errorMessage,
        );
      }

      case KafkaEvent.UPDATE_FAIL: {
        return this.buildFailedMessage(
          payload,
          KafkaEvent.UPDATE_FAIL,
          errorMessage,
        );
      }
    }
  }

  protected buildSuccessMessage(
    requestId: string,
    producedEvent: KafkaEvent,
    producedPayload: unknown,
    requesterId?: string,
  ): KafkaMessagesDto<unknown> {
    return {
      topic: this.topic,
      payload: [
        {
          requestId: requestId,
          requesterId,
          event: producedEvent,
          message: producedPayload,
        },
      ],
    };
  }

  protected async awaitEventToComplete(
    requestId: string,
    retryAmount = 0,
  ): Promise<KafkaEventsModel> {
    const maxRetries = 30;

    if (retryAmount > maxRetries) {
      throw new Error('Max retries reached awaiting events queue to clear.');
    }

    const builtCondition = {
      id: requestId,
      eventStatus: [KafkaEventStatus.SUCCEEDED, KafkaEventStatus.FAILED],
    };

    const satisfyingEvent =
      await this.kafkaEventsService.findOneKafkaEventsByCondition(
        builtCondition,
      );

    if (!satisfyingEvent) {
      await this.sleep(500);

      return this.awaitEventToComplete(requestId, retryAmount + 1);
    }

    return satisfyingEvent;
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
