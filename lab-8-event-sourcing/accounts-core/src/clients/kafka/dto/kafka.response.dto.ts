export class KafkaMetadataRecord {
  requestId: string;
  topicName: string;
  partition: number;
  errorCode: number;
  baseOffset?: string;
  logAppendTime?: string;
  logStartOffset?: string;
}