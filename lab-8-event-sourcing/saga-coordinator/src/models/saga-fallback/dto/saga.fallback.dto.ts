import { ApiProperty } from "@nestjs/swagger";
import { IsJSON, IsNotEmpty, IsUUID } from "class-validator";

export class SagaFallbackDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty()
  @IsJSON()
  @IsNotEmpty()
  executedStepsPayload: string[];

  @ApiProperty()
  @IsJSON()
  @IsNotEmpty()
  initialEntityState: any[];
}