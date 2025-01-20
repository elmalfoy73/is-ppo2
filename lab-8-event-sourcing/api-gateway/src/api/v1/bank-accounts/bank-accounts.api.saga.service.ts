import { BadRequestException, Injectable } from '@nestjs/common';
import { KafkaClient } from '../../../clients/kafka/kafka.client';
import { KafkaEventsService } from '../../../models/kafka-events/kafka.events.service';
import { KafkaTopic } from '../../../clients/kafka/enums/kafka.topic';
import { KafkaEventEmitter } from '../interfaces/kafka-event-emitter';
import { DepositOrWithdrawMoneyDto } from './dto/deposit-or-withdraw-money.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateBankAccountPurposeEnum } from './enum/update-bank-account.purpose.enum';
import { KafkaEvent } from '../../../clients/kafka/enums/kafka.event';
import { TransferMoneyDto } from "./dto/transfer-money.dto";

@Injectable()
export class BankAccountsApiSagaService extends KafkaEventEmitter {
  constructor(
    protected readonly kafkaClient: KafkaClient,
    protected readonly kafkaEventsService: KafkaEventsService,
  ) {
    super(kafkaClient, kafkaEventsService, KafkaTopic.SAGA_BANK_ACCOUNT);
  }

  async depositMoney(depositMoneyDto: DepositOrWithdrawMoneyDto) {
    const requestId = uuidv4();
    const convertedDto = {
      ...depositMoneyDto,
      purpose: UpdateBankAccountPurposeEnum.DEPOSIT,
    };

    const messages = this.preparePayload(KafkaEvent.UPDATE, requestId, [
      convertedDto,
    ]);

    return this.sendEvent(requestId, KafkaEvent.UPDATE, messages, convertedDto);
  }

  async withdrawMoney(withdrawMoneyDto: DepositOrWithdrawMoneyDto) {
    const requestId = uuidv4();
    const convertedDto = {
      ...withdrawMoneyDto,
      amount: 0 - withdrawMoneyDto.amount,
      purpose: UpdateBankAccountPurposeEnum.WITHDRAW,
    };

    const messages = this.preparePayload(KafkaEvent.UPDATE, requestId, [
      convertedDto,
    ]);

    return this.sendEvent(requestId, KafkaEvent.UPDATE, messages, convertedDto);
  }

  async transferMoney(transferMoneyDto: TransferMoneyDto) {
    const requestId = uuidv4();
    const convertedDto = {
      ...transferMoneyDto,
      purpose: UpdateBankAccountPurposeEnum.TRANSFER,
    };

    const messages = this.preparePayload(KafkaEvent.UPDATE, requestId, [
      convertedDto,
    ]);

    return this.sendEvent(requestId, KafkaEvent.UPDATE, messages, convertedDto);
  }
}