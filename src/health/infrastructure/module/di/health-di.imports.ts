import { TerminusModule } from '@nestjs/terminus';
import { ImportsDI } from '@shared/application/types/di.types';

export const healthDIImports: ImportsDI = [
  TerminusModule.forRoot({
    errorLogStyle: 'pretty',
  }),
];
