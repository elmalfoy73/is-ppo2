import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { AccountsModel } from "./accounts.model";
import { CreateAccountDto } from "./dto/create-account.dto";
import { BankAccountsModel } from "../bank-accounts/bank-accounts.model";

@Injectable()
export class AccountsRepository {
  constructor(@InjectModel(AccountsModel) private readonly accountsModel: typeof AccountsModel) {}

  async create(createAccountDto: CreateAccountDto) {
    return this.accountsModel.create({
      ...createAccountDto,
    });
  }

  async getById(id: string) {
    return this.accountsModel.findOne({
      where: {
        id,
      },
      include: [
        {
          model: BankAccountsModel,
        }
      ]
    })
  }
}