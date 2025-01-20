import { Injectable } from "@nestjs/common";
import { BankAccountsRepository } from "./bank-accounts.repository";
import { where } from "sequelize";

@Injectable()
export class BankAccountsService {
  constructor(private readonly bankAccountsRepository: BankAccountsRepository) {
  }

  async getById(id: string) {
    return this.bankAccountsRepository.getById(id);
  }

  async releaseMoney(id: string, amount: number) {
    return this.bankAccountsRepository.update({
      id,
      reservedAmount: amount,
    })
  }

  async addMoney(id: string, amount: number) {
    return this.bankAccountsRepository.update({
      id,
      amount: amount,
    })
  }

  async updateMoney(id: string, amount: number) {
    return this.bankAccountsRepository.update({
      id,
      amount: amount,
    })
  }
}