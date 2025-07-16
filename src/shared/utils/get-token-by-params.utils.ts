import { capitalize, join, map, split } from 'lodash';

export const getTokenByParams = (entity: string, suffix: string = '', prefix: string = ''): symbol => {
  return Symbol.for(
    `${prefix}${join(
      map(split(entity, '-'), (value) => capitalize(value)),
      '',
    )}${suffix}`,
  );
};
