import {
  KafkaConsumerError,
  KafkaMessagesDto,
  KafkaPayloadDto,
} from '../clients/kafka/dto/kafka.messages.dto';
import { KafkaEvent } from '../clients/kafka/enums/kafka.event';
import { KafkaTopic } from "../clients/kafka/enums/kafka.topic";
import { KafkaEventStatus } from "../clients/kafka/enums/kafka-event.status";
import { KafkaEventsService } from "../models/kafka-events/kafka.events.service";
import { areObjectsPartsEqualUtil } from "../utils/static/are-objects-parts-equal.util";

export abstract class Consumer {
  constructor(protected readonly kafkaEventsService: KafkaEventsService, protected readonly topic: KafkaTopic) {}

  abstract consume(
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
          requesterId: consumedPayload.requesterId,
          event: producedEvent,
          message: messagePayload,
        },
      ],
    };
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

  protected async failEvent(payload: KafkaPayloadDto<unknown>, payloadMessage: unknown, errorMessage: string) {
    const basicKafkaEventObject = {
      id: payload.requestId,
      requesterId: payload.requesterId,
      eventTopic: this.topic,
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
          KafkaEvent.CREATE_FAIL,
          errorMessage,
        );
      }
    }
  }

  protected async awaitEventsQueueToClear(eventTopic: KafkaTopic, event: KafkaEvent, eventStatuses: KafkaEventStatus[], payloadFilter: unknown, retryAmount = 0) {
    const maxRetries = 30;

    if (retryAmount > maxRetries) {
      throw new Error('Max retries reached awaiting events queue to clear.');
    }

    const builtCondition = {
      eventTopic,
      event,
      eventStatus: eventStatuses,
    }

    const satisfyingEvents = await this.kafkaEventsService.findAllKafkaEventsByCondition(builtCondition);

    const hasRequestedEvents = satisfyingEvents.some((satisfyingEvent) => {
      return areObjectsPartsEqualUtil(payloadFilter, satisfyingEvent.eventPayload);
    })

    if (hasRequestedEvents) {
      await this.sleep(500);

      return this.awaitEventsQueueToClear(eventTopic, event, eventStatuses, payloadFilter, retryAmount + 1);
    }
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
