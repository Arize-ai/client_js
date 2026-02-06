import { createClient } from "../client";

export type ArizeClient = ReturnType<typeof createClient>;

export type WithClient<T extends object> = T & {
  /**
   * An instance of the Arize client.
   */
  client?: ArizeClient;
};
