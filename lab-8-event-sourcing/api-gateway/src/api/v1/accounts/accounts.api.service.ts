import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { KafkaClient } from '../../../clients/kafka/kafka.client';
import { v4 as uuidv4 } from 'uuid';
import { KafkaTopic } from '../../../clients/kafka/enums/kafka.topic';
import { KafkaEvent } from '../../../clients/kafka/enums/kafka.event';
import { AccountsService } from '../../../models/accounts/accounts.service';
import { KafkaEventsService } from '../../../models/kafka-events/kafka.events.service';
import { KafkaEventEmitter } from '../interfaces/kafka-event-emitter';
import { BankAccountsService } from "../../../models/bank-accounts/bank-accounts.service";

@Injectable()
export class AccountsApiService extends KafkaEventEmitter {
  constructor(
    protected readonly kafkaClient: KafkaClient,
    protected readonly accountsService: AccountsService,
    protected readonly kafkaEventsService: KafkaEventsService,
  ) {
    super(kafkaClient, kafkaEventsService, KafkaTopic.USER_ACCOUNT);
  }

  async createAccount(createAccountDto: CreateAccountDto) {
    const requestId = uuidv4();
    const messages = this.preparePayload(KafkaEvent.CREATE, requestId, [
      createAccountDto,
    ]);

    return this.sendEvent(
      requestId,
      KafkaEvent.CREATE,
      messages,
      createAccountDto,
    );
  }

  async getAccountById(id: string) {
    if (!id) throw new BadRequestException('Empty or null id provided.');
    return this.accountsService.getAccountById(id);
  }
}