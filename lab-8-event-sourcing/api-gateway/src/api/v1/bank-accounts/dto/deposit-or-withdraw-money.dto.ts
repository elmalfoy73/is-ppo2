import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator";

export class DepositOrWithdrawMoneyDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;
}