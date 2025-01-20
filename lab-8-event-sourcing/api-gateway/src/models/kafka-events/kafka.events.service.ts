import { Injectable } from "@nestjs/common";
import { KafkaEventsRepository } from "./kafka.events.repository";
import { CreateKafkaEventDto } from "./dto/create-kafka-event.dto";

@Injectable()
export class KafkaEventsService {
  constructor(private readonly kafkaEventsRepository: KafkaEventsRepository) {
  }

  async createKafkaEvent(kafkaEvent: CreateKafkaEventDto) {
    return this.kafkaEventsRepository.create(kafkaEvent);
  }

  async createOrUpdateKafkaEvent(createKafkaEventDto: CreateKafkaEventDto) {
    const kafkaEvent = await this.kafkaEventsRepository.getById(createKafkaEventDto.id);

    if(kafkaEvent) {
      return this.kafkaEventsRepository.update(createKafkaEventDto);
    }

    return this.kafkaEventsRepository.create(createKafkaEventDto);
  }

  async getEventByRequestId(id: string) {
    return this.kafkaEventsRepository.getById(id);
  }
}