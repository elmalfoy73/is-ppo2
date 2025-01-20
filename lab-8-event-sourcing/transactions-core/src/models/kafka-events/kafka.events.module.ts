import { Module } from "@nestjs/common";
import { KafkaEventsRepository } from "./kafka.events.repository";
import { KafkaEventsService } from "./kafka.events.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { KafkaEventsModel } from "./kafka.events.model";

@Module({
  imports: [
    SequelizeModule.forFeature([KafkaEventsModel])
  ],
  providers: [KafkaEventsRepository, KafkaEventsService],
  exports: [KafkaEventsService]
})
export class KafkaEventsModule {}