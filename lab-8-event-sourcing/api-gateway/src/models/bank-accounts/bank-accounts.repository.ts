import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BankAccountsModel } from "./bank-accounts.model";
import { CreateBankAccountDto } from "./dto/create-bank-account.dto";
import { CreateBankAccountValidatedDto } from "./dto/create-bank-account.validated.dto";
import { CurrenciesModel } from "../currencies/currencies.model";
import { AccountsModel } from "../accounts/accounts.model";
import { UpdateBankAccountDto } from "./dto/update-bank-account.dto";
import { where } from "sequelize";

@Injectable()
export class BankAccountsRepository {
  constructor(@InjectModel(BankAccountsModel) private readonly bankAccountsModel: typeof BankAccountsModel) {}

  async getById(id: string) {
    return this.bankAccountsModel.findOne({
      where: {
        id,
      },
      include: [
        {
          model: CurrenciesModel
        },
        {
          model: AccountsModel,
          include: [
            {
              model: BankAccountsModel,
            }
          ]
        }
      ]
    })
  }

  async create(createBankAccountDto: CreateBankAccountValidatedDto) {
    return this.bankAccountsModel.create({
      ...createBankAccountDto,
    })
  }

  async update(updateBankAccountDto: any) {
    await this.bankAccountsModel.update({
      ...updateBankAccountDto,
    },
      {
        where: {
          id: updateBankAccountDto.id
        }
      });

    return this.getById(updateBankAccountDto.id);
  }

  async setInactive(id: string) {
    await this.bankAccountsModel.update({
      isActive: false,
    }, {
      where: {
        id: id
      }
    })

    return this.getById(id);
  }

  async setActive(id: string) {
    await this.bankAccountsModel.update({
      isActive: true,
    }, {
      where: {
        id: id
      }
    })

    return this.getById(id);
  }
}