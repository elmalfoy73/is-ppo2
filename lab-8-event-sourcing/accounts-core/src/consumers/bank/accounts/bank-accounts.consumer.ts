import { Injectable } from "@nestjs/common";
import { Consumer } from "../../consumer.interface";
import { KafkaMessagesDto, KafkaPayloadDto } from "../../../clients/kafka/dto/kafka.messages.dto";
import { KafkaEvent } from "../../../clients/kafka/enums/kafka.event";
import { KafkaTopic } from "../../../clients/kafka/enums/kafka.topic";
import { CreateAccountProducedDto } from "../../../models/accounts/dto/create-account.produced.dto";
import { KafkaEventsService } from "../../../models/kafka-events/kafka.events.service";
import { KafkaEventStatus } from "../../../clients/kafka/enums/kafka-event.status";
import { BankAccountsService } from "../../../models/bank-accounts/bank-accounts.service";
import { CreateBankAccountDto } from "../../../models/bank-accounts/dto/create-bank-account.dto";
import {
  isKafkaPayloadOfCreateBankAccountDto,
  isKafkaPayloadOfUpdateBankAccountDto
} from "../../../utils/static/is-kafka-payload-dto.util";
import { UpdateBankAccountDto } from "../../../models/bank-accounts/dto/update-bank-account.dto";
import { UpdateBankAccountPurposeEnum } from "../../../models/bank-accounts/enums/update-bank-account.purpose.enum";
import { CreateBankAccountProducedDto } from "../../../models/bank-accounts/dto/create-bank-account.produced.dto";
import { request } from "express";

@Injectable()
export class BankAccountsConsumer extends Consumer {
  constructor(
    protected readonly kafkaEventsService: KafkaEventsService,
    private readonly bankAccountsService: BankAccountsService,
  ) {
    super(kafkaEventsService, KafkaTopic.BANK_ACCOUNT);
  }

  async consume(
    payload: KafkaPayloadDto<unknown>,
  ): Promise<void | KafkaMessagesDto<unknown>> {
    switch (payload.event) {
      case KafkaEvent.CREATE: {
        if (!isKafkaPayloadOfCreateBankAccountDto(payload)) {
          return this.failEvent(
            payload,
            payload.message,
            'Payload is not assignable to CreateAccountDto',
          );
        }

        return this.handleCreate(payload);
      }

      case KafkaEvent.UPDATE: {
        if (!isKafkaPayloadOfUpdateBankAccountDto(payload)) {
          return this.failEvent(
            payload,
            payload.message,
            'Payload is not assignable to CreateAccountDto',
          );
        }

        return this.handleUpdate(payload);
      }
    }
  }

  private async handleCreate(
    payload: KafkaPayloadDto<CreateBankAccountDto>,
  ): Promise<void | KafkaMessagesDto<unknown>> {
    let createdAccount: CreateBankAccountProducedDto;

    const basicKafkaEventObject = {
      id: payload.requestId,
      requesterId: null,
      eventTopic: this.topic,
      event: KafkaEvent.CREATE,
    };

    try {
      // one bank account create request processing at time due to accounts amount limits per user
      await this.awaitEventsQueueToClear(this.topic, KafkaEvent.CREATE, [
        KafkaEventStatus.PROCESSING,
      ], { userAccountId: payload.message.userAccountId });
    } catch (error) {
      return this.failEvent(payload, payload.message, `Failed to create bank account. Error: ${error.message}`);
    }

    await this.kafkaEventsService.awaitUpdateOrCreateKafkaEvent({
      ...basicKafkaEventObject,
      eventStatus: KafkaEventStatus.PROCESSING,
      eventPayload: payload.message,
    });

    try {
      const account = await this.bankAccountsService.createAccount({ ...payload.message });
      createdAccount = account.dataValues;

      await this.kafkaEventsService.awaitUpdateOrCreateKafkaEvent({
        ...basicKafkaEventObject,
        eventStatus: KafkaEventStatus.SUCCEEDED,
        eventPayload: {
          ...createdAccount,
        },
      });
    } catch (error) {
      return this.failEvent(payload, payload.message, `Error creating bank account: ${error.message}`);
    }

    return this.buildSuccessMessage(
      payload.requestId,
      KafkaEvent.CREATE_SUCCESS,
      { ...createdAccount, requestId: payload.requestId, requesterId: payload.requesterId },
      payload.requesterId,
    );
  }
  
  private async handleUpdate(payload: KafkaPayloadDto<UpdateBankAccountDto>) {
    let updatedAccount: CreateBankAccountProducedDto;

    const basicKafkaEventObject = {
      id: payload.requestId,
      requesterId: payload.requesterId,
      eventTopic: this.topic,
      event: KafkaEvent.UPDATE,
    };


    try {
      const account = await this.bankAccountsService.updateAccount({ ...payload.message });

      await this.kafkaEventsService.awaitUpdateOrCreateKafkaEvent({
        ...basicKafkaEventObject,
        eventStatus: KafkaEventStatus.SUCCEEDED,
        eventPayload: account,
      });
    } catch (error) {
      return this.failEvent(payload, payload.message, `Error creating bank account: ${error.message}`);
    }

    return this.buildSuccessMessage(
      payload.requestId,
      KafkaEvent.UPDATE_SUCCESS,
      { ...payload.message, requestId: payload.requestId, requesterId: payload.requesterId, subEvent: payload.message.subEvent, },
      payload.requesterId,
    );
  }
}