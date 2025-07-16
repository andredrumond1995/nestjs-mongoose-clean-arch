import { ExportsDI } from '@shared/application/types/di.types';
import { UNIT_OF_WORK_TOKEN } from '../ioc-tokens/unit-of-work.ioc.tokens';

export const unitOfWorkDIExports: ExportsDI = [UNIT_OF_WORK_TOKEN];
