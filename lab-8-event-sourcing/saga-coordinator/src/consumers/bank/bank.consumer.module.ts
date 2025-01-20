import { Module } from "@nestjs/common";
import { KafkaEventsModule } from "../../models/kafka-events/kafka.events.module";
import { BankAccountsModule } from "../../models/bank-accounts/bank-accounts.module";
import { ReserveAmountSagaStep } from "./accounts/saga-steps/deposit-withdraw/reserve-amount.saga-step";
import { SagaFallbackModule } from "../../models/saga-fallback/saga.fallback.module";
import { FailFullSagaSagaStep } from "./accounts/saga-steps/deposit-withdraw/fail-full-saga.saga-step";
import { BankAccountsConsumer } from "./accounts/bank-accounts-consumer";
import {
  CreateDepositWithdrawTransactionSagaStep
} from "./accounts/saga-steps/deposit-withdraw/create-deposit-withdraw-transaction.saga-step";
import {
  InitiateTransferMoneySagaStep
} from "./accounts/saga-steps/deposit-withdraw/initiate-transfer-money.saga-step";
import {
  CreateTransferTransactionSagaStep
} from "./accounts/saga-steps/deposit-withdraw/create-transfer-transaction.saga-step";

@Module({
  imports: [KafkaEventsModule, SagaFallbackModule, BankAccountsModule],
  providers: [BankAccountsConsumer, ReserveAmountSagaStep, FailFullSagaSagaStep, CreateDepositWithdrawTransactionSagaStep, InitiateTransferMoneySagaStep, CreateTransferTransactionSagaStep],
  exports: [BankAccountsConsumer],
})
export class BankConsumerModule {}