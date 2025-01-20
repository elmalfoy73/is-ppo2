import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { BankAccountsModel } from "../bank-accounts/bank-accounts.model";
const lodash = require('lodash');

@Table({
  tableName: 'accounts',
})
export class AccountsModel extends Model<AccountsModel> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    field: 'first_name',
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    field: 'last_name',
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

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

  @HasMany(() => BankAccountsModel, 'ownerAccountId')
  bankAccounts: BankAccountsModel[];
}