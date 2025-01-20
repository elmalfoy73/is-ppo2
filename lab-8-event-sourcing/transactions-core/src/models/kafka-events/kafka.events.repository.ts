import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { KafkaEventsModel } from "./kafka.events.model";
import { CreateKafkaEventDto } from "./dto/create-kafka-event.dto";
import { KafkaEventStatus } from "../../clients/kafka/enums/kafka-event.status";
import { KafkaTopic } from "../../clients/kafka/enums/kafka.topic";
import { KafkaEvent } from "../../clients/kafka/enums/kafka.event";

@Injectable()
export class KafkaEventsRepository {
  constructor(@InjectModel(KafkaEventsModel) private readonly kafkaEventsModel: typeof KafkaEventsModel) {}

  async getById(id: string) {
    return this.kafkaEventsModel.findOne({
      where: {
        id,
      }
    })
  }

  async create(createAccountDto: CreateKafkaEventDto) {
    return this.kafkaEventsModel.create({
      ...createAccountDto,
    });
  }

  async update(updateAccountDto: Partial<CreateKafkaEventDto>) {
    if (!updateAccountDto.id) {
      return;
    }

    await this.kafkaEventsModel.update({
      ...updateAccountDto,
      id: undefined,
    }, {
      where: {
        id: updateAccountDto.id,
      }
    });
  }

  async getByCondition(condition: Record<string, unknown>) {
    return this.kafkaEventsModel.findAll({
      where: {
        ...condition,
      }
    })
  }
}