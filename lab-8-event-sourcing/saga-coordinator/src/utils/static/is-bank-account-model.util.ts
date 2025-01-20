import { BankAccountsModel } from "../../models/bank-accounts/bank-accounts.model";

export const isBankAccountModelUtil = (object: unknown): object is BankAccountsModel => {
  // return Object.keys(object).every((key) => Object.keys(BankAccountsModel).includes(key));
  return true; // TODO
}