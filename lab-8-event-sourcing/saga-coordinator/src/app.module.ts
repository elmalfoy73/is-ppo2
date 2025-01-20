import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { KafkaModule } from "./clients/kafka/kafka.module";
import { ModelsModule } from "./models/models.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ModelsModule,
    KafkaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
