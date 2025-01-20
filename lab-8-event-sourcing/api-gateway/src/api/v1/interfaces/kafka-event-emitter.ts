import { KafkaMessagesDto, KafkaPayloadDto } from "../../../clients/kafka/dto/kafka.messages.dto";
import { KafkaEvent } from "../../../clients/kafka/enums/kafka.event";
import { KafkaEventStatus } from "../../../clients/kafka/enums/kafka-event.status";
import { KafkaTopic } from "../../../clients/kafka/enums/kafka.topic";
import { KafkaClient } from "../../../clients/kafka/kafka.client";
import { KafkaEventsService } from "../../../models/kafka-events/kafka.events.service";

export abstract class KafkaEventEmitter {

  constructor(
    protected readonly kafkaClient: KafkaClient,
    protected readonly kafkaEventsService: KafkaEventsService,
    protected readonly topic: KafkaTopic
  ) {
    this.topic = topic;
  }

  protected async sendEvent(requestId: string, event: KafkaEvent, messages: KafkaMessagesDto<unknown>, dto: unknown) {
    const successHandlingPromises = [];
    const errorHandlingPromises = [];

    const metadata = await this.kafkaClient
      .emitMessages(messages)
      .then((metadata) => {
        successHandlingPromises.push(
          this.handleSentEvent(requestId, event, dto)
        );

        return metadata;
      })
      .catch((error) => this.handleFailedEvent(requestId, event, this.prepareErrorPayload(event, dto, error.message)));

    await Promise.allSettled(successHandlingPromises);
    await Promise.allSettled(errorHandlingPromises);

    return metadata;
  }

  protected preparePayload<T>(
    event: KafkaEvent,
    requestId: string,
    payload: T[],
  ): KafkaMessagesDto<T> {
    return {
      topic: this.topic,
      payload: payload.map(
        (payloadEntity): KafkaPayloadDto<T> => ({
          event,
          requestId,
          message: payloadEntity,
        }),
      ),
    };
  }

  protected prepareErrorPayload(event: KafkaEvent, dto: unknown, error: unknown) {
    return {
      emittedPayload: dto,
      event: event,
      error,
    }
  }

  protected async handleSentEvent(
    requestId: string,
    event: KafkaEvent,
    eventPayload: unknown,
  ) {
    return this.kafkaEventsService.createKafkaEvent({
      id: requestId,
      eventTopic: this.topic,
      event,
      eventStatus: KafkaEventStatus.INITIATED,
      eventPayload,
    }).catch((error) => this.handleFailedEvent(requestId, KafkaEvent.CREATE, this.prepareErrorPayload(event, eventPayload, error.message)));
  }

  protected async handleFailedEvent(
    requestId: string,
    event: KafkaEvent,
    errorPayload: unknown,
  ) {
    let messages: KafkaMessagesDto<unknown>;

    switch (event) {
      case KafkaEvent.CREATE: {
        messages = this.preparePayload(KafkaEvent.CREATE_FAIL, requestId, [
          errorPayload,
        ]);
        break;
      }

      case KafkaEvent.UPDATE: {
        messages = this.preparePayload(KafkaEvent.UPDATE_FAIL, requestId, [
          errorPayload,
        ]);
        break;
      }
    }

    await this.kafkaClient.emitMessages(messages);

    await this.kafkaEventsService.createOrUpdateKafkaEvent({
      id: requestId,
      eventTopic: this.topic,
      event,
      eventStatus: KafkaEventStatus.FAILED,
      eventPayload: errorPayload,
    })
  }
}