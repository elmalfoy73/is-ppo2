import { KafkaMessagesDto, KafkaPayloadDto } from "../../../../clients/kafka/dto/kafka.messages.dto";

export interface SagaStepInterface {
  readonly name: string;
  readonly onSuccess?: SagaStepInterface;
  readonly onFailure?: SagaStepInterface;

  handle(payload: KafkaPayloadDto<unknown>): Promise<void | KafkaMessagesDto<unknown>>;
}