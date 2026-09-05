"use server";

import { createClient } from "@/app/lib/supabase";
import { Database } from "@/app/lib/supabase.types";
import { Expense } from "./expenses.types";

export async function getExpenses() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error("Usuário não autenticado")
  const { data, error } = await supabase
    .from('expenses')
    .select('id, reference, value')
    .eq('user_id', user.id)
  if (error) throw error.message
  return data

}

export async function getExpenseByReference(reference: string): Promise<Pick<Expense, 'id' | 'value' | 'destination'>[]> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error("Usuário não autenticado")
  const { data, error } = await supabase
    .from('expenses')
    .select('id, value, destination')
    .eq('reference', reference)
    .eq('user_id', user.id)
  if (error) throw error.message
  return data
}

export async function createExpense(
  formData: Omit<Database['public']['Tables']['expenses']['Insert'], 'id' | 'user_id'>
) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error("Usuário não autenticado")

  const { data, error } = await supabase
    .from('expenses')
    .insert({
      ...formData,
      user_id: user.id
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}
