import { Module } from "@nestjs/common";
import { TransactionsRepository } from "./transactions.repository";
import { TransactionsService } from "./transactions.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { TransactionsModel } from "./transactions.model";
import { BankAccountsModel } from "../bank-accounts/bank-accounts.model";
import { BankAccountsModule } from "../bank-accounts/bank-accounts.module";

@Module({
  imports: [
    BankAccountsModule,
    SequelizeModule.forFeature([TransactionsModel])
  ],
  providers: [TransactionsRepository, TransactionsService],
  exports: [TransactionsService]
})
export class TransactionsModule {}