"use server";

import { createClient } from "@/app/lib/supabase";
import { IncomingsExpensesTransaction } from "./incomings_expenses_transactions.types";
import { randomUUID } from "node:crypto";

interface RawIncomingExpenseRow {
  reference: string | null;
  type: 'incoming' | 'expense' | null;
  value: number | null;
}

export async function getIncomingsExpensesTransactions(): Promise<IncomingsExpensesTransaction[]> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error("Usuário não autenticado")

  const { data, error } = await supabase
    .from('incomings_expenses_transactions')
    .select('*')
    .eq('user_id', user.id)

  if (error) throw error

  const grouped = ((data ?? []) as RawIncomingExpenseRow[]).reduce((acc, item) => {
    // Skip rows missing a reference — can't group what has no key.
    if (!item.reference) return acc;

    const key = item.reference;

    if (!acc[key]) {
      acc[key] = { reference: key, incoming_value: 0, expense_value: 0 }
    }

    const value = item.value ?? 0;
    if (item.type === 'incoming') {
      acc[key].incoming_value += value
    } else if (item.type === 'expense') {
      acc[key].expense_value += value
    }

    return acc
  }, {} as Record<string, { reference: string; incoming_value: number; expense_value: number }>)

  const result: IncomingsExpensesTransaction[] = Object.values(grouped).map((item) => ({
    ...item,
    id: randomUUID(),
    net_income: item.incoming_value - item.expense_value,
  }))

  return result
}