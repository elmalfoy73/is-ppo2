import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { ApiModule } from "./api/api.module";
import { ModelsModule } from "./models/models.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ApiModule,
    ModelsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
