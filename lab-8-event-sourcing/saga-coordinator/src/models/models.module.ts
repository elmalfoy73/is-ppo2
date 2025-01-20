import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AccountsModel } from "./accounts/accounts.model";
import { AccountsModule } from "./accounts/accounts.module";
import { sequelizeLogger } from "../utils/static/sequelize-logger.util";
import { KafkaEventsModule } from "./kafka-events/kafka.events.module";
import { KafkaEventsModel } from "./kafka-events/kafka.events.model";
import { BankAccountsModel } from "./bank-accounts/bank-accounts.model";
import { BankAccountsModule } from "./bank-accounts/bank-accounts.module";
import { SagaFallbackModel } from "./saga-fallback/saga.fallback.model";
import { SagaFallbackModule } from "./saga-fallback/saga.fallback.module";

@Module({
  imports: [
    AccountsModule,
    KafkaEventsModule,
    BankAccountsModule,
    SagaFallbackModule,
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
        SagaFallbackModel,
      ],
    }),
  ],
})
export class ModelsModule {}