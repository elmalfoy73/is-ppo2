import { Module } from "@nestjs/common";
import { TransactionConsumer } from "./transaction.consumer";
import { KafkaEventsModule } from "../../models/kafka-events/kafka.events.module";
import { BankAccountsModule } from "../../models/bank-accounts/bank-accounts.module";
import { TransactionsModule } from "../../models/transactions/transactions.module";

@Module({
  imports: [KafkaEventsModule, BankAccountsModule, TransactionsModule],
  providers: [TransactionConsumer],
  exports: [TransactionConsumer],
})
export class TransactionsConsumerModule {}