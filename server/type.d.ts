import type * as models from './database/Models'
import type { H3EventContext } from "h3";

declare global {
  // eslint-disable-next-line no-var
  var db: typeof models;
  type Enum<T extends object> = T[keyof T] | keyof T;
}

declare module "h3" {
  interface H3EventContext {
    user?: InstanceType<typeof db.User> | null;
  }
}

export { }
