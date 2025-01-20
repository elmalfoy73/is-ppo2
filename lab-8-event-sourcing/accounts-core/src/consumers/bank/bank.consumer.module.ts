import { Module } from "@nestjs/common";
import { BankAccountsConsumer } from "./accounts/bank-accounts.consumer";
import { KafkaEventsModule } from "../../models/kafka-events/kafka.events.module";
import { BankAccountsModule } from "../../models/bank-accounts/bank-accounts.module";

@Module({
  imports: [KafkaEventsModule, BankAccountsModule],
  providers: [BankAccountsConsumer],
  exports: [BankAccountsConsumer],
})
export class BankConsumerModule {}