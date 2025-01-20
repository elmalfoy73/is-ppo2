import { KafkaEvent } from "../clients/kafka/enums/kafka.event";

export class UpdateBankAccountFailedDto {
  requestId: string;
  event: KafkaEvent;
  message: unknown;
}