import { KafkaPayloadDto } from "../../clients/kafka/dto/kafka.messages.dto";
import { KafkaEvent } from "../../clients/kafka/enums/kafka.event";
import { CreateBankAccountDto } from "../../dto/create-bank-account.dto";
import { UpdateBankAccountDto } from "../../dto/update-bank-account.dto";
import { UpdateBankAccountPurposeEnum } from "../../enums/update-bank-account.purpose.enum";
import { UpdateBankAccountFailedDto } from "../../dto/update-bank-account.failed.dto";

export const DEFAULT_KAFKA_PAYLOAD_DATA: KafkaPayloadDto<unknown> = {
  requestId: '1',
  requesterId: '2',
  event: KafkaEvent.CREATE,
  message: null,
};

export const DEFAULT_KAFKA_PAYLOAD_OF_CREATE_BANK_ACCOUNT_DATA: KafkaPayloadDto<CreateBankAccountDto> =
  {
    requestId: '1',
    event: KafkaEvent.CREATE,
    message: {
      userAccountId: 'a',
      accountCurrency: 'b',
    },
  };

export const DEFAULT_KAFKA_PAYLOAD_OF_UPDATE_BANK_ACCOUNT_DATA: KafkaPayloadDto<UpdateBankAccountDto> =
  {
    requestId: '1',
    requesterId: null,
    event: KafkaEvent.UPDATE,
    message: {
      id: 'a',
      amount: 0.0,
      purpose: UpdateBankAccountPurposeEnum.DEPOSIT,
    },
  };