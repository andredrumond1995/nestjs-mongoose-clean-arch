import { ExportsDI } from '@shared/application/types/di.types';
import { REPOSITORY_TOKEN } from '../ioc-tokens/repositories.ioc.tokens';

export const databasesDIExports: ExportsDI = [REPOSITORY_TOKEN];
