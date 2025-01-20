import { Injectable } from "@nestjs/common";
import { AccountsRepository } from "./accounts.repository";

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {
  }

  async getAccountById(id: string) {
    return this.accountsRepository.getById(id);
  }
}