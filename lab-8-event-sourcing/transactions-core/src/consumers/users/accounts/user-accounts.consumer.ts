import { Injectable } from "@nestjs/common";
import { Consumer } from "../../consumer.interface";
import { KafkaMessagesDto, KafkaPayloadDto } from "../../../clients/kafka/dto/kafka.messages.dto";
import { AccountsService } from "../../../models/accounts/accounts.service";
import { KafkaEvent } from "../../../clients/kafka/enums/kafka.event";
import { CreateAccountDto } from "../../../models/accounts/dto/create-account.dto";
import { isKafkaPayloadOfCreateAccountDto } from "../../../utils/static/is-kafka-payload-dto.util";
import { KafkaTopic } from "../../../clients/kafka/enums/kafka.topic";
import { CreateAccountProducedDto } from "../../../models/accounts/dto/create-account.produced.dto";
import { KafkaEventsService } from "../../../models/kafka-events/kafka.events.service";
import { KafkaEventStatus } from "../../../clients/kafka/enums/kafka-event.status";

@Injectable()
export class UserAccountsConsumer extends Consumer {
  constructor(
    protected readonly kafkaEventsService: KafkaEventsService,
    private readonly accountsService: AccountsService,
  ) {
    super(kafkaEventsService, KafkaTopic.USER_ACCOUNT);
  }

  async consume(
    payload: KafkaPayloadDto<unknown>,
  ): Promise<void | KafkaMessagesDto<unknown>> {
    switch (payload.event) {
      case KafkaEvent.CREATE: {
        if (!isKafkaPayloadOfCreateAccountDto(payload)) {
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
    payload: KafkaPayloadDto<CreateAccountDto>,
  ): Promise<KafkaMessagesDto<unknown>> {
    let createdAccount: CreateAccountProducedDto;

    const basicKafkaEventObject = {
      id: payload.requestId,
      requesterId: payload.requesterId,
      eventTopic: this.topic,
      event: KafkaEvent.CREATE,
    }

    await this.kafkaEventsService.awaitUpdateOrCreateKafkaEvent({
      ...basicKafkaEventObject,
      eventStatus: KafkaEventStatus.PROCESSING,
      eventPayload: payload.message,
    });

    try {
      const account = await this.accountsService.createAccount(payload.message);
      createdAccount = account.dataValues;

      await this.kafkaEventsService.awaitUpdateOrCreateKafkaEvent({
        ...basicKafkaEventObject,
        eventStatus: KafkaEventStatus.SUCCEEDED,
        eventPayload: {
          ...createdAccount,
        }
      })
    } catch (error) {
      await this.kafkaEventsService.awaitUpdateOrCreateKafkaEvent({
        ...basicKafkaEventObject,
        eventStatus: KafkaEventStatus.FAILED,
        eventPayload: {
          ...payload.message,
          error: `Error creating user account: ${error.message}`,
        }
      })

      return this.buildFailedMessage(
            payload,
            KafkaEvent.CREATE_FAIL,
            `Error creating user account: ${error.message}`,
          )
    }

    return this.buildSuccessMessage(
      payload.requestId,
      KafkaEvent.CREATE_SUCCESS,
      { ...createdAccount, requestId: payload.requestId, requesterId: payload.requesterId },
      payload.requesterId,
    );
  }
}