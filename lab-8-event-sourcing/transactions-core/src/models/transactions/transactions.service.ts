import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository';
import { CreateTransactionDto } from '../bank-accounts/dto/create-transaction.dto';
import { BankAccountsService } from '../bank-accounts/bank-accounts.service';
import { BankAccountsModel } from '../bank-accounts/bank-accounts.model';
import { CreateTransactionPurposeEnum } from '../../consumers/transaction/enum/create-transaction-purpose.enum';
import {
  MAX_AMOUNT_PER_ALL_BANK_ACCOUNTS,
  MAX_AMOUNT_PER_EACH_BANK_ACCOUNT,
} from '../../constants/bank-account.constants';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly bankAccountsService: BankAccountsService,
  ) {}

  async createTransaction(createTransactionDto: any) {
    if (
      createTransactionDto.purpose === CreateTransactionPurposeEnum.TRANSFER
    ) {
      return this.createTransferTransaction(createTransactionDto);
    }

    const sourceAccount = await this.bankAccountsService.getById(
      createTransactionDto.sourceId,
    );
    const destAccount = await this.bankAccountsService.getById(
      createTransactionDto.destinationId,
    );

    this.validateAccounts(createTransactionDto, sourceAccount, destAccount);

    this.validateTransactionPrepared(
      createTransactionDto,
      sourceAccount,
      destAccount,
    );

    switch (createTransactionDto.purpose) {
      case CreateTransactionPurposeEnum.DEPOSIT: {
        await this.bankAccountsService.releaseMoney(
          createTransactionDto.destinationId,
          0 - createTransactionDto.amount,
        );

        await this.bankAccountsService.addMoney(
          createTransactionDto.destinationId,
          createTransactionDto.amount,
        );
        break;
      }

      case CreateTransactionPurposeEnum.WITHDRAW: {
        await this.bankAccountsService.releaseMoney(
          createTransactionDto.sourceId,
          createTransactionDto.amount,
        );
        await this.bankAccountsService.updateMoney(
          createTransactionDto.sourceId,
          createTransactionDto.amount,
        );
        break;
      }
    }

    return await this.transactionsRepository.create(createTransactionDto);
  }

  private validateAccounts(
    createTransactionDto: CreateTransactionDto,
    sourceAccount: BankAccountsModel,
    destAccount: BankAccountsModel,
  ) {
    if (
      createTransactionDto.purpose === CreateTransactionPurposeEnum.WITHDRAW &&
      !sourceAccount
    ) {
      throw new Error('Error creating transaction');
    }

    if (
      createTransactionDto.purpose === CreateTransactionPurposeEnum.DEPOSIT &&
      !destAccount
    ) {
      throw new Error('Error creating transaction');
    }

    if (
      createTransactionDto.purpose !== CreateTransactionPurposeEnum.WITHDRAW &&
      createTransactionDto.purpose !== CreateTransactionPurposeEnum.DEPOSIT &&
      (!sourceAccount || !destAccount)
    ) {
      throw new Error('Error creating transaction');
    }
  }

  private validateTransactionPrepared(
    createTransactionDto: CreateTransactionDto,
    sourceAccount: BankAccountsModel,
    destAccount: BankAccountsModel,
  ) {
    if (
      createTransactionDto.purpose === CreateTransactionPurposeEnum.TRANSFER
    ) {
      const sourceAmountExpectedAmount =
        sourceAccount.amount - createTransactionDto.amount;
      const destAmountExpectedAmount =
        destAccount.amount + createTransactionDto.amount;

      if (sourceAmountExpectedAmount < 0) {
        throw new Error('Error creating transaction 2');
      }

      if (destAmountExpectedAmount > MAX_AMOUNT_PER_EACH_BANK_ACCOUNT) {
        throw new Error('Error creating transaction 3');
      }

      const destSum = destAccount.account.bankAccounts.reduce(
        (sum, cur) => sum + cur.amount + cur.reservedAmount,
        0,
      );

      if (destSum > MAX_AMOUNT_PER_ALL_BANK_ACCOUNTS) {
        throw new Error('Error creating transaction 4');
      }
    }

    if (
      createTransactionDto.purpose === CreateTransactionPurposeEnum.WITHDRAW
    ) {
      if (Math.abs(sourceAccount.reservedAmount) < createTransactionDto.amount) {
        throw new Error('Error creating transaction 5');
      }

      if (sourceAccount.amount - createTransactionDto.amount < 0) {
        throw new Error('Error creating transaction 6');
      }
    }

    if (createTransactionDto.purpose === CreateTransactionPurposeEnum.DEPOSIT) {
      if (destAccount.reservedAmount < createTransactionDto.amount) {
        throw new Error('Error creating transaction 7');
      }

      if (
        destAccount.amount + createTransactionDto.amount >
        MAX_AMOUNT_PER_EACH_BANK_ACCOUNT
      ) {
        throw new Error('Error creating transaction 8');
      }

      const destSum = destAccount.account.bankAccounts.reduce(
        (sum, cur) => sum + cur.amount + cur.reservedAmount,
        0,
      );

      if (destSum > MAX_AMOUNT_PER_EACH_BANK_ACCOUNT) {
        throw new Error('Error creating transaction 9');
      }
    }
  }

  async createTransferTransaction(payload: any) {
    const sourceAccount = await this.bankAccountsService.getById(
      payload.sourceId,
    );
    const destAccount = await this.bankAccountsService.getById(
      payload.destinationId,
    );

    this.validateAccounts(payload, sourceAccount, destAccount);
    this.validateTransactionPrepared(payload, sourceAccount, destAccount);

    console.log(sourceAccount.reservedAmount, destAccount.reservedAmount)

      await this.bankAccountsService.releaseMoney(
        payload.sourceId,
        sourceAccount.reservedAmount + payload.amount,
      );

      await this.bankAccountsService.updateMoney(
        payload.sourceId,
        sourceAccount.amount - payload.amount,
      );

      await this.bankAccountsService.releaseMoney(
        payload.destinationId,
        destAccount.reservedAmount - payload.amount,
      );

      await this.bankAccountsService.updateMoney(
        payload.destinationId,
        destAccount.amount + payload.amount,
      );

    return await this.transactionsRepository.create(payload);
  }
}