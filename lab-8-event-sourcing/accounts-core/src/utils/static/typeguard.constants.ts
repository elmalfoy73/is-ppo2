import { KafkaPayloadDto } from '../../clients/kafka/dto/kafka.messages.dto';
import { KafkaEvent } from '../../clients/kafka/enums/kafka.event';
import { CreateAccountDto } from '../../models/accounts/dto/create-account.dto';
import { CreateBankAccountDto } from '../../models/bank-accounts/dto/create-bank-account.dto';
import { UpdateBankAccountDto } from '../../models/bank-accounts/dto/update-bank-account.dto';
import { UpdateBankAccountPurposeEnum } from '../../models/bank-accounts/enums/update-bank-account.purpose.enum';
import {
  UpdateBankAccountSagaSubeventEnum
} from "../../consumers/bank/accounts/enum/update-bank-account.saga.subevent.enum";

export const DEFAULT_KAFKA_PAYLOAD_DATA: KafkaPayloadDto<unknown> = {
  requestId: '1',
  requesterId: null,
  event: KafkaEvent.CREATE,
  message: null,
};

export const DEFAULT_KAFKA_PAYLOAD_OF_CREATE_ACCOUNT_DATA: KafkaPayloadDto<CreateAccountDto> =
  {
    requestId: '1',
    requesterId: '1',
    event: KafkaEvent.CREATE,
    message: {
      firstName: 'a',
      lastName: 'b',
      email: 'c@d.com',
    },
  };

export const DEFAULT_KAFKA_PAYLOAD_OF_CREATE_BANK_ACCOUNT_DATA: KafkaPayloadDto<CreateBankAccountDto> =
  {
    requestId: '1',
    requesterId: '1',
    event: KafkaEvent.CREATE,
    message: {
      userAccountId: 'a',
      accountCurrency: 'b',
    },
  };

export const DEFAULT_KAFKA_PAYLOAD_OF_SAGA_UPDATE_BANK_ACCOUNT_DATA: KafkaPayloadDto<UpdateBankAccountDto> =
  {
    requestId: '1',
    requesterId: '1',
    event: KafkaEvent.UPDATE,
    message: {
      id: 'a',
      amount: 0.0,
      subEvent: UpdateBankAccountSagaSubeventEnum.MONEY_RESERVE,
    },
  };