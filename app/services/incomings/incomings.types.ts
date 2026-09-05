export interface Incoming {
  id: string;
  created_at: string;
  value: number | null;
  user_id: string;
  reference: string;
  origin: string;
}