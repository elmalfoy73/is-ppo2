import { Injectable } from "@nestjs/common";
import { CurrenciesRepository } from "./currencies.repository";

@Injectable()
export class CurrenciesService {
  constructor(private readonly currenciesRepository: CurrenciesRepository) {
  }

  async getByCurrency(currency: string) {
    return this.currenciesRepository.getByCurrency(currency)
  }
}