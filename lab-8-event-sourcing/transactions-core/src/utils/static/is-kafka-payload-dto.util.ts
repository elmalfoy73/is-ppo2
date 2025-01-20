import { KafkaPayloadDto } from "../../clients/kafka/dto/kafka.messages.dto";
import { CreateAccountDto } from "../../models/accounts/dto/create-account.dto";
import {
  DEFAULT_KAFKA_PAYLOAD_DATA,
  DEFAULT_KAFKA_PAYLOAD_OF_CREATE_ACCOUNT_DATA,
  DEFAULT_KAFKA_PAYLOAD_OF_CREATE_BANK_ACCOUNT_DATA
} from "./typeguard.constants";
import { CreateTransactionDto } from "../../models/bank-accounts/dto/create-transaction.dto";
import { UpdateBankAccountDto } from "../../models/bank-accounts/dto/update-bank-account.dto";

const _basicTypeguard = (payload: unknown, comparedObject: unknown) => {
  return Object.keys(payload).every((key) => {
    return Object.keys(comparedObject).some((defaultKey) => {
      return defaultKey === key
    } )
  });
}

export const isKafkaPayloadDto = (payload: unknown) : payload is KafkaPayloadDto<unknown> => {
  return _basicTypeguard(payload, DEFAULT_KAFKA_PAYLOAD_DATA);
}

export const isKafkaPayloadOfCreateAccountDto = (payload: unknown) : payload is KafkaPayloadDto<CreateAccountDto> => {
  return _basicTypeguard(payload, DEFAULT_KAFKA_PAYLOAD_OF_CREATE_ACCOUNT_DATA);
}

export const isKafkaPayloadOfCreateTransactionDto = (payload: unknown) : payload is KafkaPayloadDto<CreateTransactionDto> => {
  return _basicTypeguard(payload, DEFAULT_KAFKA_PAYLOAD_OF_CREATE_BANK_ACCOUNT_DATA);
}