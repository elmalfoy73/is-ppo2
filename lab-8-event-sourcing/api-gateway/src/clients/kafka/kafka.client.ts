import { Injectable, Logger } from "@nestjs/common";
import { Consumer, Kafka, KafkaMessage, logLevel, Producer } from "kafkajs";
import { KafkaMetadataRecord } from "./dto/kafka.response.dto";
import { KafkaMessagesDto } from "./dto/kafka.messages.dto";

@Injectable()
export class KafkaClient {
  client: Kafka;

  private producer: Producer;
  private consumer: Consumer;

  private readonly logger = new Logger(KafkaClient.name);

  constructor() {
    this.client = new Kafka({
      clientId: 'apiGateway',
      brokers: ['127.0.0.1:9092'],
      logLevel: logLevel.WARN,
    });

    this.producer = this.client.producer({
      allowAutoTopicCreation: true,
      transactionalId: 'apiGateway',
      idempotent: true
    });
    this.consumer = this.client.consumer({
      groupId: 'apiGateway',
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
  }

  async disconnect() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

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
        .then((metadataResponse) => metadataResponse && metadataResponse.length > 0 && { ...metadataResponse[0], requestId: message.key });

      promises.push(promise);
    });

    return Promise.all<KafkaMetadataRecord>(promises);
  }
}