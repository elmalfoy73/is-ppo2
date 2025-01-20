import { Module } from "@nestjs/common";
import { UserConsumerModule } from "./users/user.consumer.module";
import { ConsumerDefinerService } from "./consumer.definer.service";
import { TransactionsConsumerModule } from "./transaction/transactions.consumer.module";

@Module({
  imports: [UserConsumerModule, TransactionsConsumerModule],
  providers: [ConsumerDefinerService],
  exports: [ConsumerDefinerService],
})
export class ConsumersModule {}