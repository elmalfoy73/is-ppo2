import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateBankAccountValidatedDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ownerAccountId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  currencyId: string;
}