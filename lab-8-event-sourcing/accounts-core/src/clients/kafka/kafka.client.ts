import { Injectable } from '@nestjs/common';
import { Consumer, Kafka, logLevel, Producer } from "kafkajs";
import { KafkaMetadataRecord } from "./dto/kafka.response.dto";
import { KafkaMessagesDto } from "./dto/kafka.messages.dto";
import { ConsumerDefinerService } from "../../consumers/consumer.definer.service";
import { KAFKA_SUBSCRIPTABLE_TOPICS } from "../../constants/kafka.constants";

@Injectable()
export class KafkaClient {
  client: Kafka;

  private producer: Producer;
  private consumer: Consumer;

  constructor(private readonly consumerDefiner: ConsumerDefinerService) {
    this.client = new Kafka({
      clientId: 'accountsCore',
      brokers: ['127.0.0.1:9092'],
      logLevel: logLevel.WARN,
    });

    this.producer = this.client.producer({
      allowAutoTopicCreation: true,
    });
    this.consumer = this.client.consumer({
      allowAutoTopicCreation: true,
      groupId: 'accountsCore',
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  async connect() {
    await this.producer.connect();
    await this.consumer.connect();

    await this.consumer.subscribe({ topics: [...KAFKA_SUBSCRIPTABLE_TOPICS] });

    await this.consumer.run({
      eachMessage: async (messagePayload) => {
        const producingMessages = await this.consumerDefiner.define(messagePayload);

        if (producingMessages) {
          await this.emitMessages(producingMessages);
        }
      },
    })
  }

  async disconnect() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  // async emitMessages<T>(messagesDto: KafkaMessagesDto<T>): Promise<KafkaMetadataRecord[]> {
  async emitMessages<T>(messagesDto: KafkaMessagesDto<T>): Promise<KafkaMetadataRecord[]> {
    const promises = [];
    const messages = messagesDto.payload.map((payloadEntity) => ({
      key: payloadEntity.requestId,
      value: JSON.stringify({
        ...payloadEntity,
        requestId: undefined,
      })
    }));

    messages.forEach((message) => {
      const promise = this.producer
        .send({
          topic: messagesDto.topic,
          messages: [message],
        })
        .then((metadataResponse) => metadataResponse && metadataResponse.length > 0 && { ...metadataResponse[0], requestId: message.key })
        .catch((e) => console.error(e.message, e));

      promises.push(promise);
    });

    return await Promise.all<KafkaMetadataRecord>(promises);
  }
}