import { Injectable } from "@nestjs/common";
import { BankAccountsRepository } from "./bank-accounts.repository";
import { BankAccountsModel } from "./bank-accounts.model";

@Injectable()
export class BankAccountsService {
  constructor(private readonly bankAccountsRepository: BankAccountsRepository) {
  }

  async getById(id: string) {
    return this.bankAccountsRepository.getById(id);
  }

  async rollback(initialState: BankAccountsModel) {
    return this.bankAccountsRepository.updateWholeModel(initialState);
  }
}