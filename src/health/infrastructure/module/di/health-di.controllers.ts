import { ControllersDI } from '@shared/application/types/di.types';
import { HealthCheckController } from 'src/health/presentation/controllers/health-check.controller';

export const healthDIControllers: ControllersDI = [HealthCheckController];
