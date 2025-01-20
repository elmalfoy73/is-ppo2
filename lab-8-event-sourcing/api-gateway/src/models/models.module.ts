import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AccountsModel } from "./accounts/accounts.model";
import { AccountsModule } from "./accounts/accounts.module";
import { sequelizeLogger } from "../utils/static/sequelize-logger.util";
import { KafkaEventsModel } from "./kafka-events/kafka.events.model";
import { KafkaEventsModule } from "./kafka-events/kafka.events.module";
import { BankAccountsModel } from "./bank-accounts/bank-accounts.model";
import { CurrenciesModel } from "./currencies/currencies.model";
import { BankAccountsModule } from "./bank-accounts/bank-accounts.module";
import { CurrenciesModule } from "./currencies/currencies.module";

@Module({
  imports: [
    AccountsModule,
    KafkaEventsModule,
    BankAccountsModule,
    CurrenciesModule,
    SequelizeModule.forRoot({
      logging: sequelizeLogger,
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'asdf',
      password: '12345678',
      database: 'db',
      models: [
        AccountsModel,
        KafkaEventsModel,
        BankAccountsModel,
        CurrenciesModel,
      ],
    }),
  ],
})
export class ModelsModule {}