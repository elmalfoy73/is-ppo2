import { Injectable } from "@nestjs/common";
import { KafkaEventsService } from "../../../models/kafka-events/kafka.events.service";

@Injectable()
export class CoreApiService {
  constructor(private readonly kafkaEventsService: KafkaEventsService ) {
  }
  async getRequestStatusByRequestId(requestId: string) {
    const event = await this.kafkaEventsService.getEventByRequestId(requestId);

    return {
      requestId: event.id,
      status: event.eventStatus,
      payload: event.eventPayload,
    }
  }
}