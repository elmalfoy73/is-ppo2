import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { BankAccountsModel } from "./bank-accounts.model";
import { BankAccountsRepository } from "./bank-accounts.repository";
import { BankAccountsService } from "./bank-accounts.service";
import { CurrenciesModule } from "../currencies/currencies.module";
import { AccountsModule } from "../accounts/accounts.module";

@Module({
  imports: [
    SequelizeModule.forFeature([BankAccountsModel]),
    CurrenciesModule,
    AccountsModule,
  ],
  providers: [BankAccountsRepository, BankAccountsService],
  exports: [BankAccountsService]
})
export class BankAccountsModule {}