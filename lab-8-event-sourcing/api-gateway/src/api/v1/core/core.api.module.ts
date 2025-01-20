import { CoreApiService } from "./core.api.service";
import { Module } from "@nestjs/common";
import { CoreApiController } from "./core.api.controller";
import { KafkaEventsModule } from "../../../models/kafka-events/kafka.events.module";

@Module({
  imports: [KafkaEventsModule],
  providers: [CoreApiService],
  controllers: [CoreApiController],
  exports: [CoreApiService],
})
export class CoreApiModule {}