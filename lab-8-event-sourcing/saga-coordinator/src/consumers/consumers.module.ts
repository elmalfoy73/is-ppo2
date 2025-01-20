import { Module } from "@nestjs/common";
import { BankConsumerModule } from "./bank/bank.consumer.module";
import { ConsumerDefinerService } from "./consumer.definer.service";
import { SagaFallbackModule } from "../models/saga-fallback/saga.fallback.module";

@Module({
  imports: [BankConsumerModule],
  providers: [ConsumerDefinerService],
  exports: [ConsumerDefinerService],
})
export class ConsumersModule {}