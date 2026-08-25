import Dexie from "dexie";

class BookkeepingDatabase extends Dexie {
  expenses!: Dexie.Table<{
    id: string;
    user_id: string;
    destination: string;
    value: number;
    due_date: string | null;
    payment_day: string | null;
  }, string>;

  incomings!: Dexie.Table<{
    id: number;
    created_at: string;
    value: number | null;
  }, number>;

  profiles!: Dexie.Table<{
    id: string;
    user_id: string;
    name: string;
    occupation: string | null;
  }, string>;

  constructor() {
    super("bookkeeping");
    
    this.version(1).stores({
      expenses: "id, user_id, destination, due_date, payment_day",
      incomings: "id, created_at",
      profiles: "id, user_id, name"
    });
  }
}

export const db = new BookkeepingDatabase();