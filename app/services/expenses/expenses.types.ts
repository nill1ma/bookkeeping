export interface Expense {
  id: string;
  destination: string;
  value: number;
  payment_day: string | null;
  due_date: string | null;
  user_id: string;
  reference: string;
}