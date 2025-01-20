import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { SagaFallbackModel } from "./saga.fallback.model";
import { SagaFallbackRepository } from "./saga.fallback.repository";
import { SagaFallbackService } from "./saga.fallback.service";

@Module({
  imports: [
    SequelizeModule.forFeature([SagaFallbackModel])
  ],
  providers: [SagaFallbackRepository, SagaFallbackService],
  exports: [SagaFallbackService]
})
export class SagaFallbackModule {}