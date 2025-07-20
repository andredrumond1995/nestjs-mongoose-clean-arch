import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const PublicRoute = (): CustomDecorator => SetMetadata('PUBLIC_ROUTE', true);
