import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  UpdateBankAccountSagaSubeventEnum
} from "../../../consumers/bank/accounts/enum/update-bank-account.saga.subevent.enum";

export class UpdateBankAccountDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNumber()
  amount?: number;

  @ApiProperty()
  @IsNumber()
  reservedAmount?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subEvent: UpdateBankAccountSagaSubeventEnum;
}