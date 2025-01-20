import { Module } from "@nestjs/common";
import { KafkaClient } from "./kafka.client";
import { UtilsModule } from "../../utils/utils.module";
import { ConsumersModule } from "../../consumers/consumers.module";

@Module({
  imports: [UtilsModule, ConsumersModule],
  providers: [KafkaClient],
  exports: [KafkaClient],
})
export class KafkaModule {}