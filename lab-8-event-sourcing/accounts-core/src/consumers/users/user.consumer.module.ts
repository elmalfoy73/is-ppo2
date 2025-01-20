import { Module } from "@nestjs/common";
import { UserAccountsConsumer } from "./accounts/user-accounts.consumer";
import { AccountsModule } from "../../models/accounts/accounts.module";
import { KafkaEventsModule } from "../../models/kafka-events/kafka.events.module";

@Module({
  imports: [KafkaEventsModule, AccountsModule],
  providers: [UserAccountsConsumer],
  exports: [UserAccountsConsumer],
})
export class UserConsumerModule {}