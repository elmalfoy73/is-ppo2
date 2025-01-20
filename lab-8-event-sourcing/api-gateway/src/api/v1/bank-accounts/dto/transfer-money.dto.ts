import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class TransferMoneyDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  sourceId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  destinationId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}