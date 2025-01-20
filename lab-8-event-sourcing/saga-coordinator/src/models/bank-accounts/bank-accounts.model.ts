import { BelongsTo, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { AccountsModel } from "../accounts/accounts.model";

@Table({
  tableName: 'bank_accounts',
})
export class BankAccountsModel extends Model<BankAccountsModel> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'owner_account_id'
  })
  ownerAccountId: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: 0.0,
  })
  amount: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: 0.0,
    field: 'reserved_amount'
  })
  reservedAmount: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'currency_id'
  })
  currencyId: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
    field: 'is_active'
  })
  isActive: boolean;

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
  updatedAt: Date;

  @BelongsTo(() => AccountsModel, 'ownerAccountId')
  account: AccountsModel;
}