import { Injectable } from "@nestjs/common";
import { BankAccountsRepository } from "./bank-accounts.repository";
import { CreateBankAccountDto } from "./dto/create-bank-account.dto";
import { AccountsService } from "../accounts/accounts.service";
import { AccountsModel } from "../accounts/accounts.model";
import { CurrenciesModel } from "../currencies/currencies.model";
import { CurrenciesService } from "../currencies/currencies.service";
import { BankAccountsModel } from "./bank-accounts.model";
import {
  UpdateBankAccountSagaSubeventEnum
} from "../../consumers/bank/accounts/enum/update-bank-account.saga.subevent.enum";
import {
  MAX_AMOUNT_OF_CREATED_BANK_ACCOUNTS,
  MAX_AMOUNT_PER_ALL_BANK_ACCOUNTS,
  MAX_AMOUNT_PER_EACH_BANK_ACCOUNT
} from "../../constants/bank-account.constants";

@Injectable()
export class BankAccountsService {
  constructor(private readonly bankAccountsRepository: BankAccountsRepository, private readonly currenciesService: CurrenciesService, private readonly accountsService: AccountsService) {
  }

  async createAccount(createBankAccountDto: CreateBankAccountDto) {
    const userAccount = await this.accountsService.getById(createBankAccountDto.userAccountId);
    const currency = await this.currenciesService.getByCurrency(createBankAccountDto.accountCurrency);

    this.validateCreateAccount(createBankAccountDto, userAccount, currency);

    return this.bankAccountsRepository.create({
      ownerAccountId: userAccount.id,
      currencyId: currency.id,
    })
  }

  async updateAccount(updateBankAccountDto: any) {
    switch (updateBankAccountDto.subEvent) {
      case UpdateBankAccountSagaSubeventEnum.MONEY_RESERVE: {
        const bankAccount = await this.bankAccountsRepository.getById(updateBankAccountDto.id);
        this.validateMoneyReserveSubEvent(bankAccount, updateBankAccountDto);

        updateBankAccountDto.reservedAmount = updateBankAccountDto.reservedAmount + bankAccount.reservedAmount;

        return [await this.bankAccountsRepository.update(updateBankAccountDto)];
      }

      case UpdateBankAccountSagaSubeventEnum.MONEY_TRANSFER: {
        const sourceBankAccount = await this.bankAccountsRepository.getById(updateBankAccountDto.sourceId);
        const destBankAccount = await this.bankAccountsRepository.getById(updateBankAccountDto.destinationId);

        this.validateMoneyTransferSubEvent(sourceBankAccount, destBankAccount, updateBankAccountDto);

        const a = await this.bankAccountsRepository.update({
          id: sourceBankAccount.id,
          reservedAmount: sourceBankAccount.reservedAmount - updateBankAccountDto.reservedAmount,
          subEvent: UpdateBankAccountSagaSubeventEnum.MONEY_TRANSFER
        });

        const b = await this.bankAccountsRepository.update({
          id: destBankAccount.id,
          reservedAmount: destBankAccount.reservedAmount + updateBankAccountDto.reservedAmount,
          subEvent: UpdateBankAccountSagaSubeventEnum.MONEY_TRANSFER
        });


        return [a, b]
      }
    }

  }

  private validateCreateAccount(createBankAccountDto: CreateBankAccountDto, userAccount: AccountsModel, currency: CurrenciesModel) {
    if (!userAccount) {
      throw new Error(`User ${createBankAccountDto.userAccountId} account not found`);
    }

    if (!(currency && currency.isActive)) {
      throw new Error(`Currency ${createBankAccountDto.accountCurrency} is not active or not found.`);
    }

    if (userAccount.bankAccounts.length >= MAX_AMOUNT_OF_CREATED_BANK_ACCOUNTS) {
      throw new Error(`User ${createBankAccountDto.userAccountId} has ${userAccount.bankAccounts.length} accounts already`);
    }
  }

  private validateMoneyReserveSubEvent(bankAccount: BankAccountsModel, updateBankAccountDto: any) {
    if (!bankAccount) {
      throw new Error(`Bank account ${updateBankAccountDto.id} not found.`);
    }

    if (!updateBankAccountDto.reservedAmount && updateBankAccountDto.reservedAmount !== 0) {
      throw new Error('ReservedAmount should be provided to reserve money.');
    }

    if (!bankAccount.currency.isActive || !bankAccount.isActive) {
      throw new Error('Currency/account are not active.');
    }

    if (bankAccount.amount + bankAccount.reservedAmount + updateBankAccountDto.reservedAmount > MAX_AMOUNT_PER_EACH_BANK_ACCOUNT) {
      throw new Error(`Cannot reserve ${updateBankAccountDto.reservedAmount} ${bankAccount.currency.currency}. It leads to increase the limit of ${MAX_AMOUNT_PER_EACH_BANK_ACCOUNT} per bank account.`);
    }

    if (bankAccount.amount + bankAccount.reservedAmount + updateBankAccountDto.reservedAmount < 0) {
      throw new Error(`Cannot reserve ${updateBankAccountDto.reservedAmount} ${bankAccount.currency.currency}. It leads to negative balance of ${bankAccount.amount + bankAccount.reservedAmount + updateBankAccountDto.reservedAmount}.`);
    }

    const newAccountSum = updateBankAccountDto.reservedAmount + bankAccount.account.bankAccounts.reduce((sum, account) => sum + account.amount + account.reservedAmount, 0.0);

    if (newAccountSum > MAX_AMOUNT_PER_ALL_BANK_ACCOUNTS) {
      throw new Error(`Cannot reserve ${updateBankAccountDto.reservedAmount} ${bankAccount.currency.currency}. It leads to increase the limit of ${MAX_AMOUNT_PER_ALL_BANK_ACCOUNTS} per user's account.`);
    }
  }

  private validateMoneyTransferSubEvent(sourceBankAccount: BankAccountsModel, destBankAccount: BankAccountsModel, updateBankAccountDto: any) {
    this.validateMoneyReserveSubEvent(sourceBankAccount, { ...updateBankAccountDto, reservedAmount: 0 - updateBankAccountDto.reservedAmount });
    this.validateMoneyReserveSubEvent(destBankAccount, updateBankAccountDto);
  }
}