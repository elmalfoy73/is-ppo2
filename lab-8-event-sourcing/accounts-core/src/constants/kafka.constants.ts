import { KafkaTopic } from '../clients/kafka/enums/kafka.topic';

export const KAFKA_SUBSCRIPTABLE_TOPICS = new Set<string>([
  KafkaTopic.USER_ACCOUNT,
  KafkaTopic.BANK_ACCOUNT,
]);