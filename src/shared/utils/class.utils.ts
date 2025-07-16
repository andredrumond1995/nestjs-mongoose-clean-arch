export function getContextName(methodName: string): string {
  return `${this.constructor.name}.${methodName}`;
}
