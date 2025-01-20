import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { KafkaEventsModel } from "./kafka.events.model";
import { CreateKafkaEventDto } from "./dto/create-kafka-event.dto";

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

  async getAllByCondition(condition: Record<string, unknown>) {
    return this.kafkaEventsModel.findAll({
      where: {
        ...condition,
      }
    })
  }

  async getOneByCondition(condition: Record<string, unknown>) {
    return this.kafkaEventsModel.findOne({
      where: {
        ...condition,
      }
    })
  }
}