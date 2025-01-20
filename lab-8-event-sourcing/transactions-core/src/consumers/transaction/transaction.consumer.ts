import { Injectable } from "@nestjs/common";
import { Consumer } from "../consumer.interface";
import { KafkaMessagesDto, KafkaPayloadDto } from "../../clients/kafka/dto/kafka.messages.dto";
import { KafkaEvent } from "../../clients/kafka/enums/kafka.event";
import { KafkaTopic } from "../../clients/kafka/enums/kafka.topic";
import { KafkaEventsService } from "../../models/kafka-events/kafka.events.service";
import { KafkaEventStatus } from "../../clients/kafka/enums/kafka-event.status";
import { BankAccountsService } from "../../models/bank-accounts/bank-accounts.service";
import { CreateTransactionDto } from "../../models/bank-accounts/dto/create-transaction.dto";
import {
  isKafkaPayloadOfCreateTransactionDto,
} from "../../utils/static/is-kafka-payload-dto.util";
import { TransactionsService } from "../../models/transactions/transactions.service";
import { CreateTransactionProducedDto } from "../../models/transactions/dto/create-transaction.produced.dto";

@Injectable()
export class TransactionConsumer extends Consumer {
  constructor(
    protected readonly kafkaEventsService: KafkaEventsService,
    private readonly bankAccountsService: BankAccountsService,
    private readonly transactionsService: TransactionsService,
  ) {
    super(kafkaEventsService, KafkaTopic.TRANSACTION);
  }

  async consume(
    payload: KafkaPayloadDto<unknown>,
  ): Promise<void | KafkaMessagesDto<unknown>> {
    switch (payload.event) {
      case KafkaEvent.CREATE: {
        if (!isKafkaPayloadOfCreateTransactionDto(payload)) {
          return this.failEvent(
            payload,
            payload.message,
            'Payload is not assignable to CreateAccountDto',
          );
        }

        return this.handleCreate(payload);
      }
    }
  }

  private async handleCreate(
    payload: KafkaPayloadDto<CreateTransactionDto>,
  ): Promise<void | KafkaMessagesDto<unknown>> {
    let createdAccount: CreateTransactionProducedDto;

    const basicKafkaEventObject = {
      id: payload.requestId,
      requesterId: payload.requesterId,
      eventTopic: this.topic,
      event: KafkaEvent.CREATE,
    };

    await this.kafkaEventsService.awaitUpdateOrCreateKafkaEvent({
      ...basicKafkaEventObject,
      eventStatus: KafkaEventStatus.PROCESSING,
      eventPayload: payload.message,
    });

    try {
      const account = await this.transactionsService.createTransaction(payload.message);

      await this.kafkaEventsService.awaitUpdateOrCreateKafkaEvent({
        ...basicKafkaEventObject,
        eventStatus: KafkaEventStatus.SUCCEEDED,
        eventPayload: account,
      });
    } catch (error) {
      return this.failEvent(payload, payload.message, `Error creating transaction: ${error.message}`);
    }

    return this.buildSuccessMessage(
      payload.requestId,
      KafkaEvent.CREATE_SUCCESS,
      { ...createdAccount, requestId: payload.requestId, requesterId: payload.requesterId },
      payload.requesterId,
    );
  }
}