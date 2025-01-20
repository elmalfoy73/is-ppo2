import { KafkaTopic } from "../enums/kafka.topic";
import { KafkaEvent } from "../enums/kafka.event";

export class KafkaPayloadDto<T> {
  requestId: string;
  event: KafkaEvent;
  message: T;
}

export class KafkaMessagesDto<T> {
  topic: KafkaTopic;
  payload: KafkaPayloadDto<T>[];
}