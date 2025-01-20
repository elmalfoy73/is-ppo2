import { Column, DataType, Model, Table } from "sequelize-typescript";
import { KafkaTopic } from "../../clients/kafka/enums/kafka.topic";
import { KafkaEventStatus } from "../../clients/kafka/enums/kafka-event.status";
import { KafkaEvent } from "../../clients/kafka/enums/kafka.event";

@Table({
  tableName: 'kafka_events',
})
export class KafkaEventsModel extends Model<KafkaEventsModel> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    field: 'requester_id',
  })
  requesterId: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(KafkaTopic),
    field: 'event_topic',
    allowNull: false,
  })
  eventTopic: KafkaTopic;

  @Column({
    type: DataType.ENUM,
    values: Object.values(KafkaTopic),
    field: 'event',
    allowNull: false,
  })
  event: KafkaEvent;

  @Column({
    type: DataType.ENUM,
    values: Object.values(KafkaEventStatus),
    field: 'event_status',
    allowNull: false,
  })
  eventStatus: KafkaEventStatus;

  @Column({
    type: DataType.JSONB,
    field: 'event_payload',
  })
  eventPayload: any;

  @Column({
    type: DataType.DATE,
    field: 'created_at',
    allowNull: false,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    field: 'updated_at',
    allowNull: false,
  })
  updatedAt: Date;
}