"use server";

import { createClient } from "@/app/lib/supabase";
import { Database } from "@/app/lib/supabase.types";

export async function getIncomings() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error("Usuário não autenticado")
  const { data, error } = await supabase
    .from('incomings')
    .select('*')
    .eq('user_id', user.id)
  if (error) throw error.message
  return data

}

export async function getIncomingByReference(reference: string) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error("Usuário não autenticado")
  const { data, error } = await supabase
    .from('incomings')
    .select('*')
    .eq('reference', reference)
    .eq('user_id', user.id)
  if (error) throw error.message
  return data
}

export async function createIncoming(
  // Omitimos o 'id' (gerado pelo banco) e o 'user_id' (injetado pelo backend)
  formData: Omit<Database['public']['Tables']['incomings']['Insert'], 'id' | 'user_id'>
) {
  const supabase = await createClient()

  // 1. Pega o usuário logado direto dos cookies seguros do Supabase Auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error("Usuário não autenticado")

  // 2. Insere os dados juntando o formulário com o ID do usuário verificado
  const { data, error } = await supabase
    .from('incomings')
    .insert({
      ...formData,
      user_id: user.id // Injeção segura no servidor
    })
    .select()        // Garante que o Supabase retorne os dados inseridos
    .single()        // Avisa que é apenas um objeto (e não uma lista)

  if (error) throw new Error(error.message)
  return data
}
