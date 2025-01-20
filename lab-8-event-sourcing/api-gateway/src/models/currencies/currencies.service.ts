import { Injectable } from "@nestjs/common";
import { CurrenciesRepository } from "./currencies.repository";

@Injectable()
export class CurrenciesService {
  constructor(private readonly currenciesRepository: CurrenciesRepository) {
  }

  async getByName(name: string) {
    return this.currenciesRepository.getByName(name)
  }
}