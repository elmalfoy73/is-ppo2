import { Injectable } from "@nestjs/common";
import { SagaFallbackRepository } from "./saga.fallback.repository";
import { SagaFallbackDto } from "./dto/saga.fallback.dto";

@Injectable()
export class SagaFallbackService {
  constructor(private readonly sagaFallbackRepository: SagaFallbackRepository) {
  }

  async saveState(state: SagaFallbackDto) {
    return this.sagaFallbackRepository.save(state);
  }

  async removeByRequestId(requestId: string) {
    return this.sagaFallbackRepository.remove(requestId);
  }

  async restore() {
    return this.sagaFallbackRepository.findAll();
  }
}