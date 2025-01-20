import { KafkaTopic } from '../clients/kafka/enums/kafka.topic';

export const KAFKA_SUBSCRIPTABLE_TOPICS = new Set<string>([
  KafkaTopic.TRANSACTION
]);