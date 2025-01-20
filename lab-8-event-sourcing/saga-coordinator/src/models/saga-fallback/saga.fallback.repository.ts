import { InjectModel } from "@nestjs/sequelize";
import { Injectable } from "@nestjs/common";
import { SagaFallbackModel } from "./saga.fallback.model";
import { SagaFallbackDto } from "./dto/saga.fallback.dto";

@Injectable()
export class SagaFallbackRepository {
  constructor(@InjectModel(SagaFallbackModel) private readonly sagaFallbackModel: typeof SagaFallbackModel) {
  }

  async save(state: SagaFallbackDto) {
    const sagaState = await this.sagaFallbackModel.findOne({
      where: {
        requestId: state.requestId
      }
    })

    if (sagaState) {
      return this.sagaFallbackModel.update({
        ...state
      }, {
        where: {
          requestId: state.requestId,
        }
      })
    }

    await this.sagaFallbackModel.create({
      ...state,
    })
  }

  async remove(requestId: string) {
    if (requestId) {
      return this.sagaFallbackModel.destroy({
        where: {
          requestId: requestId,
        }
      })
    }
  }

  async findAll() {
    return this.sagaFallbackModel.findAll();
  }
}