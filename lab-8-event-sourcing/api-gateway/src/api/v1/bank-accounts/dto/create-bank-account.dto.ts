import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateBankAccountDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userAccountId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountCurrency: string;
}