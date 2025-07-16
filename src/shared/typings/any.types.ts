export type RecordAny = Record<string, any>;

export type MergedTypes<T> = {
  [K in keyof T]?: T[K];
};

export type Stringified<T> = string & { __type: T };
