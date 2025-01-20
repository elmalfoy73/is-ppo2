import { Module } from "@nestjs/common";
import { AccountsRepository } from "./accounts.repository";
import { AccountsService } from "./accounts.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { AccountsModel } from "./accounts.model";

@Module({
  imports: [
    SequelizeModule.forFeature([AccountsModel])
  ],
  providers: [AccountsRepository, AccountsService],
  exports: [AccountsService]
})
export class AccountsModule {}