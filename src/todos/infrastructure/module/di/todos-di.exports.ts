import { ExportsDI } from '@shared/application/types/di.types';
import { TODOS_SERVICE_TOKEN } from '../ioc-tokens/services/todos-service.ioc.tokens';

export const todosDIExports: ExportsDI = [TODOS_SERVICE_TOKEN];
