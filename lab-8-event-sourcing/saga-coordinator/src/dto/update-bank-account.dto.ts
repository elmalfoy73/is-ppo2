import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UpdateBankAccountPurposeEnum } from "../enums/update-bank-account.purpose.enum";

export class UpdateBankAccountDto {
  @ApiProperty()
  @IsUUID()
  id?: string;

  @ApiProperty()
  @IsNumber()
  amount?: number;

  @ApiProperty()
  @IsString()
  purpose?: UpdateBankAccountPurposeEnum;

  @ApiProperty()
  @IsString()
  subEvent?: UpdateBankAccountPurposeEnum;
}