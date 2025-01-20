import { KafkaMessagesDto, KafkaReceivedMessageDto } from "../clients/kafka/dto/kafka.messages.dto";
import { Transaction } from "kafkajs";

export interface ConsumerDefiner {
  define(message: KafkaReceivedMessageDto): Promise<void | KafkaMessagesDto<unknown>>;
}