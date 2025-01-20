import { Injectable } from "@nestjs/common";
import { KafkaEventsRepository } from "./kafka.events.repository";
import { CreateKafkaEventDto } from "./dto/create-kafka-event.dto";
import { KafkaEventStatus } from "../../clients/kafka/enums/kafka-event.status";
import { KafkaTopic } from "../../clients/kafka/enums/kafka.topic";
import { KafkaEvent } from "../../clients/kafka/enums/kafka.event";

@Injectable()
export class KafkaEventsService {
  private readonly forbiddenTransferToProcessingStatuses = [KafkaEventStatus.PROCESSING, KafkaEventStatus.FAILED, KafkaEventStatus.SUCCEEDED];

  constructor(private readonly kafkaEventsRepository: KafkaEventsRepository) {
  }

  async createKafkaEvent(kafkaEvent: CreateKafkaEventDto) {
    return this.kafkaEventsRepository.create(kafkaEvent);
  }

  async awaitUpdateOrCreateKafkaEvent(createKafkaEventDto: CreateKafkaEventDto) {
    console.log(createKafkaEventDto.eventTopic)
    return this.awaitUpdateKafkaEvent(createKafkaEventDto, 10);
  }

  async findAllKafkaEventsByCondition(condition: Record<string, unknown>) {
    return this.kafkaEventsRepository.getAllByCondition(condition);
  }

  async findOneKafkaEventsByCondition(condition: Record<string, unknown>) {
    return this.kafkaEventsRepository.getOneByCondition(condition);
  }

  private async awaitUpdateKafkaEvent(createKafkaEventDto: CreateKafkaEventDto, maxRetries: number, retryAmount: number = 0) {
    if (retryAmount > maxRetries && maxRetries > 0) {
      return this.createKafkaEvent(createKafkaEventDto);
    }

    const kafkaEvent = await this.kafkaEventsRepository.getById(createKafkaEventDto.id);

    if (!kafkaEvent) {
      await this.sleep(500);

      return this.awaitUpdateKafkaEvent(createKafkaEventDto, maxRetries, retryAmount + 1);
    }

    if (createKafkaEventDto.eventStatus === KafkaEventStatus.PROCESSING && this.forbiddenTransferToProcessingStatuses.includes(kafkaEvent?.eventStatus)) {
      return;
    }

    if (kafkaEvent) {
      return this.kafkaEventsRepository.update(createKafkaEventDto);
    }

    return this.kafkaEventsRepository.create(createKafkaEventDto);
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}