import { Module } from "@nestjs/common";
import { AccountsApiService } from "./accounts.api.service";
import { AccountsApiController } from "./accounts.api.controller";
import { KafkaModule } from "../../../clients/kafka/kafka.module";
import { AccountsModule } from "../../../models/accounts/accounts.module";
import { KafkaEventsModule } from "../../../models/kafka-events/kafka.events.module";

@Module({
  imports: [KafkaModule, AccountsModule, KafkaEventsModule],
  controllers: [AccountsApiController],
  providers: [AccountsApiService],
  exports: [AccountsApiService]
})
export class AccountsApiModule {}