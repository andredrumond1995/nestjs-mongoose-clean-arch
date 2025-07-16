export interface IModuleRef {
  get<T>(token: symbol, options?: { strict: boolean }): T;
}
