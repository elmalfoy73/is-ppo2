import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CurrenciesModel } from "./currencies.model";
import { CurrenciesRepository } from "./currencies.repository";
import { CurrenciesService } from "./currencies.service";

@Module({
  imports: [
    SequelizeModule.forFeature([CurrenciesModel])
  ],
  providers: [CurrenciesRepository, CurrenciesService],
  exports: [CurrenciesService]
})
export class CurrenciesModule {}