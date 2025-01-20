import { Module } from "@nestjs/common";
import { AccountsApiModule } from "./v1/accounts/accounts.api.module";
import { RouterModule } from "@nestjs/core";
import { CoreApiModule } from "./v1/core/core.api.module";
import { BankAccountsApiModule } from "./v1/bank-accounts/bank-accounts.api.module";

@Module({
  imports: [
    AccountsApiModule,
    CoreApiModule,
    BankAccountsApiModule,
    RouterModule.register([
      {
        path: 'api/v1',
        module: CoreApiModule,
      },
      {
        path: 'api/v1',
        module: AccountsApiModule,
      },
      {
        path: 'api/v1',
        module: BankAccountsApiModule,
      }
    ]),
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class ApiModule {}