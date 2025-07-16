import { ProvidersDI } from '@shared/application/types/di.types';
import { REPOSITORY_TOKEN } from '../ioc-tokens/repositories.ioc.tokens';
import { Repository } from '@shared/infrastructure/repositories';

export const databasesDIProviders: ProvidersDI = [{ provide: REPOSITORY_TOKEN, useClass: Repository }];
