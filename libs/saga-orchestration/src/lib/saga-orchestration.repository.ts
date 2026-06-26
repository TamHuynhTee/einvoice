import { SAGA_STATUS, SAGA_STEP_STATUS, SAGA_TYPE } from '@common/constants/enum/saga.enum';
import { SagaInstance, SagaInstanceModel, SagaInstanceModelName } from '@common/schemas/saga.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SagaOrchestrationRepository {
  constructor(@InjectModel(SagaInstanceModelName) private readonly sagaModel: SagaInstanceModel) {}

  private assertStepIndex(stepIndex: number) {
    if (!Number.isInteger(stepIndex) || stepIndex < 0) {
      throw new Error(`Invalid saga step index: ${stepIndex}`);
    }
  }

  create(sagaType: SAGA_TYPE, context: Record<string, any>, stepNames: string[]) {
    const steps = stepNames.map((name) => ({
      stepName: name,
      status: SAGA_STEP_STATUS.PENDING,
    }));

    const saga = new this.sagaModel({
      sagaType,
      status: SAGA_STATUS.PENDING,
      currentStep: 0,
      steps,
      context,
    });

    return saga.save();
  }

  async findById(sagaId: string) {
    return this.sagaModel.findById(sagaId).exec();
  }

  async updateStatus(sagaId: string, status: SAGA_STATUS, error?: string) {
    const update: Partial<SagaInstance> = { status };

    if (error) {
      update.error = error;
    }

    return this.sagaModel.findByIdAndUpdate(sagaId, update, { returnDocument: 'after' }).exec();
  }

  async updateCurrentStep(sagaId: string, stepIndex: number) {
    return this.sagaModel.findByIdAndUpdate(sagaId, { currentStep: stepIndex }, { returnDocument: 'after' }).exec();
  }

  async updateContext(sagaId: string, context: Record<string, any>) {
    return this.sagaModel.findByIdAndUpdate(sagaId, { context }, { returnDocument: 'after' }).exec();
  }

  async markStepRunning(sagaId: string, stepIndex: number) {
    this.assertStepIndex(stepIndex);

    return this.sagaModel
      .findByIdAndUpdate(
        sagaId,
        {
          [`steps.${stepIndex}.status`]: SAGA_STEP_STATUS.RUNNING,
          [`steps.${stepIndex}.startedAt`]: new Date(),
        },
        { returnDocument: 'after' },
      )
      .exec();
  }

  async markStepCompleted(sagaId: string, stepIndex: number, data?: any) {
    this.assertStepIndex(stepIndex);

    return this.sagaModel
      .findByIdAndUpdate(
        sagaId,
        {
          [`steps.${stepIndex}.status`]: SAGA_STEP_STATUS.COMPLETED,
          [`steps.${stepIndex}.startedAt`]: new Date(),
          [`steps.${stepIndex}.data`]: data,
        },
        { returnDocument: 'after' },
      )
      .exec();
  }

  async markStepFailed(sagaId: string, stepIndex: number, error: string) {
    this.assertStepIndex(stepIndex);

    return this.sagaModel
      .findByIdAndUpdate(
        sagaId,
        {
          [`steps.${stepIndex}.status`]: SAGA_STEP_STATUS.FAILED,
          [`steps.${stepIndex}.startedAt`]: new Date(),
          [`steps.${stepIndex}.error`]: error,
        },
        { returnDocument: 'after' },
      )
      .exec();
  }

  async markStepCompensating(sagaId: string, stepIndex: number) {
    this.assertStepIndex(stepIndex);

    return this.sagaModel
      .findByIdAndUpdate(
        sagaId,
        {
          [`steps.${stepIndex}.status`]: SAGA_STEP_STATUS.COMPENSATING,
        },
        { returnDocument: 'after' },
      )
      .exec();
  }

  async markStepCompensated(sagaId: string, stepIndex: number) {
    this.assertStepIndex(stepIndex);

    return this.sagaModel
      .findByIdAndUpdate(
        sagaId,
        {
          [`steps.${stepIndex}.status`]: SAGA_STEP_STATUS.COMPENSATED,
          [`steps.${stepIndex}.startedAt`]: new Date(),
        },
        { returnDocument: 'after' },
      )
      .exec();
  }
}
