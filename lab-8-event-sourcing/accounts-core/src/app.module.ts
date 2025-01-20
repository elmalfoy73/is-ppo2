import { Module } from '@nestjs/common';
import { KafkaModule } from "./clients/kafka/kafka.module";
import { ModelsModule } from "./models/models.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    KafkaModule,
    ModelsModule
  ],
})
export class AppModule {}
