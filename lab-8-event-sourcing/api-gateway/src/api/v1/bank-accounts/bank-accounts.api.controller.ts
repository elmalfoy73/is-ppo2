import { Body, Controller, Delete, Param, Post, Query, UseInterceptors } from "@nestjs/common";
import { HttpLoggingInterceptor } from "../../../interceptors/http-logging-interceptor.service";
import { BankAccountsApiService } from "./bank-accounts.api.service";
import { CreateBankAccountDto } from "./dto/create-bank-account.dto";
import { DepositOrWithdrawMoneyDto } from "./dto/deposit-or-withdraw-money.dto";
import { BankAccountsApiSagaService } from "./bank-accounts.api.saga.service";
import { TransferMoneyDto } from "./dto/transfer-money.dto";

@Controller({
  path: "bank_accounts",
  version: '1.0',
})
@UseInterceptors(HttpLoggingInterceptor)
export class BankAccountsApiController {
  constructor(
    private readonly service: BankAccountsApiService,
    private readonly sagaService: BankAccountsApiSagaService) {
  }

  @Post('create_account')
  async createAccount(@Body() createBankAccountDto: CreateBankAccountDto) {
    return this.service.createAccount(createBankAccountDto);
  }

  @Post('deposit_money')
  async depositMoney(@Body() depositMoneyDto: DepositOrWithdrawMoneyDto) {
    return this.sagaService.depositMoney(depositMoneyDto);
  }

  @Post('withdraw_money')
  async withdrawMoney(@Body() withdrawMoneyDto: DepositOrWithdrawMoneyDto) {
    return this.sagaService.withdrawMoney(withdrawMoneyDto);
  }
  @Post('transfer_money')
  async transferMoney(@Body() transferMoneyDto: TransferMoneyDto) {
    return this.sagaService.transferMoney(transferMoneyDto);
  }

  @Delete('account/:id')
  async deleteAccount(@Param('id') id: string) {
    return this.service.deleteAccountById(id);
  }

  @Post('account/:id')
  async ctivateAccount(@Param('id') id: string) {
    return this.service.activateAccountById(id);
  }
}