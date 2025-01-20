import { KafkaTopic } from '../clients/kafka/enums/kafka.topic';

export const KAFKA_SUBSCRIPTABLE_TOPICS = new Set<string>([
  KafkaTopic.SAGA_BANK_ACCOUNT, KafkaTopic.BANK_ACCOUNT, KafkaTopic.TRANSACTION,
]);