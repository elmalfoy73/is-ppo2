import { ApiProperty } from "@nestjs/swagger";
import { IsJSON, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { KafkaTopic } from "../../../clients/kafka/enums/kafka.topic";
import { KafkaEventStatus } from "../../../clients/kafka/enums/kafka-event.status";
import { KafkaEvent } from "../../../clients/kafka/enums/kafka.event";

export class CreateKafkaEventDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  requesterId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  eventTopic: KafkaTopic;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  event: KafkaEvent;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  eventStatus: KafkaEventStatus;

  @ApiProperty()
  @IsJSON()
  @IsNotEmpty()
  eventPayload: unknown;
}