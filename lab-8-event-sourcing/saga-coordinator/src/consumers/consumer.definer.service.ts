import { Injectable, Logger } from "@nestjs/common";
import { ConsumerDefiner } from "./consumer.definer.interface";
import { KafkaMessagesDto, KafkaPayloadDto, KafkaReceivedMessageDto } from "../clients/kafka/dto/kafka.messages.dto";
import { isKafkaPayloadDto } from "../utils/static/is-kafka-payload-dto.util";
import { KafkaTopic } from "../clients/kafka/enums/kafka.topic";
import { BankAccountsConsumer } from "./bank/accounts/bank-accounts-consumer";

@Injectable()
export class ConsumerDefinerService implements ConsumerDefiner {
  private readonly logger = new Logger(ConsumerDefinerService.name);

  constructor(
    private readonly bankAccountsConsumer: BankAccountsConsumer) {
  }

  async define(message: KafkaReceivedMessageDto): Promise<void | KafkaMessagesDto<unknown>> {
    const messageValue = JSON.parse(message.message.value.toString());

    if (!isKafkaPayloadDto(messageValue)) {
      this.logger.error(`Received message with unknown payload type: ${JSON.stringify(messageValue)}`);
      throw new Error('Received message with unknown payload type')
    }

    const payload: KafkaPayloadDto<unknown> = {
      requestId: message.message.key.toString(),
      requesterId: messageValue.requesterId,
      event: messageValue.event,
      message: messageValue.message,
    }

    const convertedTopic = KafkaTopic[Object.keys(KafkaTopic).find((key) => KafkaTopic[key] === message.topic)];

    this.logger.log(`[${payload.requestId}] Received message with payload: ${JSON.stringify(payload)}]`)

    const response = this.defineMessageConsumer(convertedTopic, payload);

    response.then((responsePayload) => {
      this.logger.log(`[${payload.requestId}] Handled message. Payload: ${JSON.stringify(responsePayload)}`);
      return responsePayload;
    })

    return response;
  }

  private async defineMessageConsumer(topic: KafkaTopic, payload: KafkaPayloadDto<unknown>): Promise<void | KafkaMessagesDto<unknown>> {
    switch (topic) {
      case KafkaTopic.SAGA_BANK_ACCOUNT:
      case KafkaTopic.BANK_ACCOUNT:
      case KafkaTopic.TRANSACTION: {
        return this.bankAccountsConsumer.consume(topic, payload);
      }
    }
  }
}