import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { BankAccountsRepository } from "./bank-accounts.repository";
import { AccountsService } from "../accounts/accounts.service";
import { CurrenciesService } from "../currencies/currencies.service";

@Injectable()
export class BankAccountsService {
  constructor(private readonly bankAccountsRepository: BankAccountsRepository, private readonly currenciesService: CurrenciesService, private readonly accountsService: AccountsService) {
  }

  async deleteById(id: string) {
    const account = await this.bankAccountsRepository.getById(id);

    if(!account) {
      throw new NotFoundException(`Account ${id} not found`);
    }

    if (account.amount + account.reservedAmount > 0) {
      throw new BadRequestException(`Account has amount of ${account.amount + account.reservedAmount} ${account.currency.currency}`)
    }

    return await this.bankAccountsRepository.setInactive(id)
  }

  async activateById(id: string) {
    const account = await this.bankAccountsRepository.getById(id);

    if(!account) {
      throw new NotFoundException(`Account ${id} not found`);
    }

    if (account.amount + account.reservedAmount > 0) {
      throw new BadRequestException(`Account has amount of ${account.amount + account.reservedAmount} ${account.currency.currency}`)
    }

    return await this.bankAccountsRepository.setActive(id)
  }
}