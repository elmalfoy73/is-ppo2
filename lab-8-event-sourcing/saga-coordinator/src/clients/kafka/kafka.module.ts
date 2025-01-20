import { Module } from "@nestjs/common";
import { KafkaClient } from "./kafka.client";
import { ConsumersModule } from "../../consumers/consumers.module";

@Module({
  imports: [ConsumersModule],
  providers: [KafkaClient],
  exports: [KafkaClient],
})
export class KafkaModule {}