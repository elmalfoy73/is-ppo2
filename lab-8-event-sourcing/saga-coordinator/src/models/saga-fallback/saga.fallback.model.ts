import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: 'saga_fallback',
})
export class SagaFallbackModel extends Model<SagaFallbackModel> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    allowNull: false,
    field: 'request_id'
  })
  requestId: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'executed_steps_payload',
  })
  executedStepsPayload: string[];

  @Column({
    type: DataType.JSONB,
    field: 'initial_entity_state',
  })
  initialEntityState: any[];

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'updated_at',
  })
  updatedAt: Date;
}