export function reaisToNumber(value: string): number {
  const valueWithoutDot = value.replace(/\./g, '');
  const valueWithDot = valueWithoutDot.replace(',', '.');
  return parseFloat(valueWithDot);
}
