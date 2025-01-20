import { KafkaPayloadDto } from "../../clients/kafka/dto/kafka.messages.dto";
import {
  DEFAULT_KAFKA_PAYLOAD_DATA,
  DEFAULT_KAFKA_PAYLOAD_OF_UPDATE_BANK_ACCOUNT_DATA,
} from "./typeguard.constants";
import { UpdateBankAccountDto } from "../../dto/update-bank-account.dto";
import { KafkaEvent } from "../../clients/kafka/enums/kafka.event";

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

export const isKafkaPayloadOfUpdateBankAccountDto = (payload: unknown) : payload is KafkaPayloadDto<UpdateBankAccountDto> => {
  return _basicTypeguard(payload, DEFAULT_KAFKA_PAYLOAD_OF_UPDATE_BANK_ACCOUNT_DATA);
}

export const isKafkaPayloadOfUpdateBankAccountResponseDto = (payload: unknown) : payload is KafkaPayloadDto<UpdateBankAccountDto> => {
  return isKafkaPayloadOfUpdateBankAccountDto(payload) && !!payload.message.subEvent;
}

export const isKafkaPayloadOfUpdateFailedBankAccountResponseDto = (payload: unknown) : payload is KafkaPayloadDto<UpdateBankAccountDto> => {
  return isKafkaPayloadDto(payload) && Object.keys(payload.message).includes('subEvent');
}