import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator";

export class UpdateBankAccountProducedDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  ownerAccountId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  reservedAmount: number;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  currencyId: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}