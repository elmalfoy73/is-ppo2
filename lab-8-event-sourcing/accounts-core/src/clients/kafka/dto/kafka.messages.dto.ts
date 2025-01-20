import { KafkaTopic } from "../enums/kafka.topic";
import { KafkaEvent } from "../enums/kafka.event";
import { KafkaMessage } from "kafkajs";

export class KafkaPayloadDto<T> {
  requestId: string;
  requesterId?: string;
  event: KafkaEvent;
  message: T;
}

export class KafkaMessagesDto<T> {
  topic: KafkaTopic;
  payload: KafkaPayloadDto<T>[];
}

export class KafkaConsumerError {
  consumedPayload: Partial<KafkaPayloadDto<unknown>>;
  producedReason: string;
}

export interface KafkaReceivedMessageDto {
  topic: string
  message: KafkaMessage
  heartbeat(): Promise<void>
  pause(): () => void
}