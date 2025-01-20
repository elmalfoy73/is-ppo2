import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { KafkaEventsService } from '../../../models/kafka-events/kafka.events.service';
import { v4 as uuidv4 } from 'uuid';
import { KafkaEvent } from '../../../clients/kafka/enums/kafka.event';
import { KafkaClient } from '../../../clients/kafka/kafka.client';
import { KafkaEventEmitter } from '../interfaces/kafka-event-emitter';
import { KafkaTopic } from '../../../clients/kafka/enums/kafka.topic';
import { BankAccountsService } from "../../../models/bank-accounts/bank-accounts.service";

@Injectable()
export class BankAccountsApiService extends KafkaEventEmitter {
  constructor(
    protected readonly kafkaClient: KafkaClient,
    protected readonly kafkaEventsService: KafkaEventsService,
    protected readonly service: BankAccountsService,
  ) {
    super(kafkaClient, kafkaEventsService, KafkaTopic.BANK_ACCOUNT);
  }

  async createAccount(createBankAccountDto: CreateBankAccountDto) {
    const requestId = uuidv4();

    const messages = this.preparePayload(KafkaEvent.CREATE, requestId, [
      createBankAccountDto,
    ]);

    return this.sendEvent(
      requestId,
      KafkaEvent.CREATE,
      messages,
      createBankAccountDto,
    );
  }

  async deleteAccountById(id: string) {
    if (!id) throw new BadRequestException('Empty or null id provided.');

    return this.service.deleteById(id)
  }

  async activateAccountById(id: string) {
    if (!id) throw new BadRequestException('Empty or null id provided.');

    return this.service.activateById(id)
  }
}