import { Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { CoreApiService } from "./core.api.service";
import { HttpLoggingInterceptor } from "../../../interceptors/http-logging-interceptor.service";

@Controller({
  path: "core",
  version: '1.0',
})
@UseInterceptors(HttpLoggingInterceptor)
export class CoreApiController {
  constructor(private readonly coreApiService: CoreApiService) {
  }

  @Get('request_status/:request_id')
  async getRequestStatusByRequestId(@Param('request_id') requestId: string) {
    return this.coreApiService.getRequestStatusByRequestId(requestId);
  }
}
