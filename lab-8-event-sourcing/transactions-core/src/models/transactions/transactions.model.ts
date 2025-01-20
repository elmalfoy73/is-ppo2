import { BelongsTo, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { BankAccountsModel } from "../bank-accounts/bank-accounts.model";
import { CreateTransactionPurposeEnum } from "../../consumers/transaction/enum/create-transaction-purpose.enum";

@Table({
  tableName: 'transactions',
})
export class TransactionsModel extends Model<TransactionsModel> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    field: 'source_id',
  })
  sourceId?: string;

  @Column({
    type: DataType.UUID,
    field: 'destination_id',
  })
  destinationId?: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.ENUM,
    values: Object.values(CreateTransactionPurposeEnum),
    allowNull: false,
  })
  purpose: CreateTransactionPurposeEnum;

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

  @BelongsTo(() => BankAccountsModel, 'sourceId')
  sourceAccount?: BankAccountsModel;

  @BelongsTo(() => BankAccountsModel, 'destinationId')
  destinationAccount?: BankAccountsModel;
}