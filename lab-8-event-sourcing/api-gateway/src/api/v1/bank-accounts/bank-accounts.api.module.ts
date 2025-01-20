import { Module } from "@nestjs/common";
import { BankAccountsApiController } from "./bank-accounts.api.controller";
import { BankAccountsApiService } from "./bank-accounts.api.service";
import { KafkaModule } from "../../../clients/kafka/kafka.module";
import { KafkaEventsModule } from "../../../models/kafka-events/kafka.events.module";
import { BankAccountsApiSagaService } from "./bank-accounts.api.saga.service";
import { BankAccountsModule } from "../../../models/bank-accounts/bank-accounts.module";

@Module({
  imports: [KafkaModule, KafkaEventsModule, BankAccountsModule],
  controllers: [BankAccountsApiController],
  providers: [BankAccountsApiService, BankAccountsApiSagaService],
  exports: [BankAccountsApiService, BankAccountsApiSagaService]
})
export class BankAccountsApiModule {}