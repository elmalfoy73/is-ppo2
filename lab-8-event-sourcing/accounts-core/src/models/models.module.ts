import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AccountsModel } from "./accounts/accounts.model";
import { AccountsModule } from "./accounts/accounts.module";
import { sequelizeLogger } from "../utils/static/sequelize-logger.util";
import { KafkaEventsModule } from "./kafka-events/kafka.events.module";
import { KafkaEventsModel } from "./kafka-events/kafka.events.model";
import { CurrenciesModel } from "./currencies/currencies.model";
import { CurrenciesModule } from "./currencies/currencies.module";
import { BankAccountsModel } from "./bank-accounts/bank-accounts.model";
import { BankAccountsModule } from "./bank-accounts/bank-accounts.module";

@Module({
  imports: [
    AccountsModule,
    KafkaEventsModule,
    CurrenciesModule,
    BankAccountsModule,
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
        CurrenciesModel,
        BankAccountsModel,
      ],
    }),
  ],
})
export class ModelsModule {}