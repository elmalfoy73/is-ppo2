import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BankAccountsModel } from "./bank-accounts.model";
import { CreateBankAccountDto } from "./dto/create-bank-account.dto";
import { CreateBankAccountValidatedDto } from "./dto/create-bank-account.validated.dto";
import { where } from "sequelize";

@Injectable()
export class BankAccountsRepository {
  constructor(@InjectModel(BankAccountsModel) private readonly bankAccountsModel: typeof BankAccountsModel) {}

  async getById(id: string) {
    return this.bankAccountsModel.findOne({
      where: {
        id,
      }
    })
  }

  async create(createBankAccountDto: CreateBankAccountValidatedDto) {
    return this.bankAccountsModel.create({
      ...createBankAccountDto,
    })
  }

  async updateWholeModel(initialState: BankAccountsModel) {
    return this.bankAccountsModel.update({
      ...initialState,
    }, {
      where: {
        id: initialState.id
      }
    })
  }
}