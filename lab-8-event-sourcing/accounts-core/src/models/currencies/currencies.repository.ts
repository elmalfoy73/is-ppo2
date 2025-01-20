import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CurrenciesModel } from "./currencies.model";

@Injectable()
export class CurrenciesRepository {
  constructor(@InjectModel(CurrenciesModel) private readonly kafkaEventsModel: typeof CurrenciesModel) {}

  async getByCurrency(currency: string) {
    return this.kafkaEventsModel.findOne({
      where: {
        currency,
      }
    })
  }
}