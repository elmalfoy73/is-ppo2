import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

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
}