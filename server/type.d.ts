import type * as models from './database/Models'
declare global {
  // eslint-disable-next-line no-var
  var db: typeof models;
  type Enum<T extends object> = T[keyof T] | keyof T;
}
export { }
