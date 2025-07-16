export type RecordAny = Record<string, any>;

export type MergedTypes<T> = {
  [K in keyof T]?: T[K];
};
