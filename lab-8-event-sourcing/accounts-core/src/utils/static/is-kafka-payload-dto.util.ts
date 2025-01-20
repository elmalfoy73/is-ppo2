import { KafkaPayloadDto } from "../../clients/kafka/dto/kafka.messages.dto";
import { CreateAccountDto } from "../../models/accounts/dto/create-account.dto";
import {
  DEFAULT_KAFKA_PAYLOAD_DATA,
  DEFAULT_KAFKA_PAYLOAD_OF_CREATE_ACCOUNT_DATA,
  DEFAULT_KAFKA_PAYLOAD_OF_CREATE_BANK_ACCOUNT_DATA, DEFAULT_KAFKA_PAYLOAD_OF_SAGA_UPDATE_BANK_ACCOUNT_DATA
} from "./typeguard.constants";
import { CreateBankAccountDto } from "../../models/bank-accounts/dto/create-bank-account.dto";
import { UpdateBankAccountDto } from "../../models/bank-accounts/dto/update-bank-account.dto";

const _basicTypeguard = (payload: unknown, comparedObject: unknown) => {
  return Object.keys(payload).every((key) => {
    return Object.keys(comparedObject).some((defaultKey) => {
      return defaultKey === key && (typeof payload[key] === typeof comparedObject[defaultKey] || key === 'message' || key === 'requesterId')
    } )
  });
}

export const isKafkaPayloadDto = (payload: unknown) : payload is KafkaPayloadDto<unknown> => {
  return _basicTypeguard(payload, DEFAULT_KAFKA_PAYLOAD_DATA);
}

export const isKafkaPayloadOfCreateAccountDto = (payload: unknown) : payload is KafkaPayloadDto<CreateAccountDto> => {
  return _basicTypeguard(payload, DEFAULT_KAFKA_PAYLOAD_OF_CREATE_ACCOUNT_DATA);
}

export const isKafkaPayloadOfCreateBankAccountDto = (payload: unknown) : payload is KafkaPayloadDto<CreateBankAccountDto> => {
  return _basicTypeguard(payload, DEFAULT_KAFKA_PAYLOAD_OF_CREATE_BANK_ACCOUNT_DATA);
}

export const isKafkaPayloadOfUpdateBankAccountDto = (payload: unknown) : payload is KafkaPayloadDto<UpdateBankAccountDto> => {
  return _basicTypeguard(payload, DEFAULT_KAFKA_PAYLOAD_OF_SAGA_UPDATE_BANK_ACCOUNT_DATA);
}