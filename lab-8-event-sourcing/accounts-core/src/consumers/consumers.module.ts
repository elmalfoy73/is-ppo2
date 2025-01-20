import { Module } from "@nestjs/common";
import { BankConsumerModule } from "./bank/bank.consumer.module";
import { UserConsumerModule } from "./users/user.consumer.module";
import { ConsumerDefinerService } from "./consumer.definer.service";

@Module({
  imports: [UserConsumerModule, BankConsumerModule],
  providers: [ConsumerDefinerService],
  exports: [ConsumerDefinerService],
})
export class ConsumersModule {}