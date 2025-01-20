import { Injectable } from "@nestjs/common";
import { AccountsRepository } from "./accounts.repository";
import { CreateAccountDto } from "./dto/create-account.dto";

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {
  }

  async createAccount(createAccountDto: CreateAccountDto) {
    return this.accountsRepository.create(createAccountDto);
  }

  async getById(id: string) {
    return this.accountsRepository.getById(id);
  }
}