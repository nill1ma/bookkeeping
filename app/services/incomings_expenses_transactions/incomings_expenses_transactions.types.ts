import { UUID } from "node:crypto";

export interface IncomingsExpensesTransaction {
  id: UUID,
  reference: string,
  incoming_value: number,
  expense_value: number,
  net_income: number
}