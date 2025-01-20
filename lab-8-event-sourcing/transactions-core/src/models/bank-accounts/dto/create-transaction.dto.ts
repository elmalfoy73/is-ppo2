import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from "class-validator";
import { CreateTransactionPurposeEnum } from "../../../consumers/transaction/enum/create-transaction-purpose.enum";

export class CreateTransactionDto {
  @ApiProperty()
  @IsUUID()
  sourceId?: string;

  @ApiProperty()
  @IsUUID()
  destinationId?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  purpose: CreateTransactionPurposeEnum;
}