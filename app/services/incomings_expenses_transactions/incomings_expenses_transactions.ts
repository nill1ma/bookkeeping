"use server";

import { createClient } from "@/app/lib/supabase";
import { IncomingsExpensesTransaction } from "./incomings_expenses_transactions.types";
import { randomUUID } from "node:crypto";

export async function getIncomingsExpensesTransactions(): Promise<IncomingsExpensesTransaction[]> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error("Usuário não autenticado")
  const { data, error } = await supabase
    .from('incomings_expenses_transactions')
    .select('*')
    .eq('user_id', user.id)
  if (error) throw error.message

  const grouped = (data ?? []).reduce((acc, item) => {
    if (!acc[item.reference]) {
      acc[item.reference] = { reference: item.reference, incoming_value: 0, expense_value: 0 }
    }
    acc[item.reference][item.type === 'incoming' ? 'incoming_value' : 'expense_value'] += item.value
    return acc
  }, {} as Record<string, { reference: string; incoming_value: number; expense_value: number }>)

  const result: IncomingsExpensesTransaction[] = Object.values(grouped).map((item) => ({
    ...item,
    id:randomUUID(),
    net_income: item.incoming_value - item.expense_value,
  }))

  return result

}