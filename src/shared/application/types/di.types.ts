import { DynamicModule, ForwardReference, Provider, Abstract, Type } from '@nestjs/common';

export type ExportsDI = (string | symbol | DynamicModule | ForwardReference<any> | Provider | Abstract<any>)[];

export type ImportsDI = (Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference<any>)[];

export type ProvidersDI = Provider[];

export type ControllersDI = Type<any>[];
