import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { TransactionsModel } from "./transactions.model";
import { BankAccountsModel } from "../bank-accounts/bank-accounts.model";
import { CreateTransactionDto } from "../bank-accounts/dto/create-transaction.dto";

@Injectable()
export class TransactionsRepository {
  constructor(@InjectModel(TransactionsModel) private readonly accountsModel: typeof TransactionsModel) {}

  async create(createAccountDto: CreateTransactionDto) {
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