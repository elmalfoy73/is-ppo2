import { KafkaPayloadDto } from '../../clients/kafka/dto/kafka.messages.dto';
import { KafkaEvent } from '../../clients/kafka/enums/kafka.event';
import { CreateAccountDto } from '../../models/accounts/dto/create-account.dto';
import { CreateTransactionDto } from '../../models/bank-accounts/dto/create-transaction.dto';
import { CreateTransactionPurposeEnum } from '../../consumers/transaction/enum/create-transaction-purpose.enum';

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

export const DEFAULT_KAFKA_PAYLOAD_OF_CREATE_BANK_ACCOUNT_DATA: KafkaPayloadDto<CreateTransactionDto> =
  {
    requestId: '1',
    requesterId: '1',
    event: KafkaEvent.UPDATE,
    message: {
      sourceId: 'a',
      destinationId: 'a',
      amount: 0.0,
      purpose: CreateTransactionPurposeEnum.WITHDRAW,
    },
  };