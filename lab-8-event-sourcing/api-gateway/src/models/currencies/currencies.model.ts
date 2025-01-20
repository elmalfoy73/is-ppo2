import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";

@Table({
  tableName: 'currencies',
})
export class CurrenciesModel extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  currency: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'created_at'
  })
  createdAt: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'updated_at'
  })
  updatedAt: string;
}