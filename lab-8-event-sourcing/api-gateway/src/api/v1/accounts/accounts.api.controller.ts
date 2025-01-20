import { Body, Controller, Delete, Get, Param, Post, Query, UseInterceptors } from "@nestjs/common";
import { CreateAccountDto } from "./dto/create-account.dto";
import { AccountsApiService } from "./accounts.api.service";
import { HttpLoggingInterceptor } from "../../../interceptors/http-logging-interceptor.service";

@Controller({
  path: 'accounts',
  version: '1.0',
})
@UseInterceptors(HttpLoggingInterceptor)
export class AccountsApiController {
  constructor(private readonly service: AccountsApiService) {}

  @Post('create_account')
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.service.createAccount(createAccountDto);
  }

  @Get('account/:id')
  async getAccountById(@Param('id') id: string) {
    return this.service.getAccountById(id);
  }
}