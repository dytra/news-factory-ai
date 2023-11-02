import { SupabaseClient, createClient } from "@supabase/supabase-js";
require('dotenv').config();

const supabase = createClient( //@ts-ignore
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPBASE_API_KEY
);

class DBEngine<T> {
  // private dbProvider;
  constructor(private dbProvider: T) {
    // return this.dbProvider;
  }

  getProvider() {
    return this.dbProvider;
  }

  // getProvider() {
  //   return new this.dbProvider()
  // }
}
const dbProvider = supabase;
const dbInstance = new DBEngine<typeof dbProvider>(dbProvider);
const db = dbInstance.getProvider();
export default db;