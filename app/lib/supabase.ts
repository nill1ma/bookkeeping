import { createServerClient, createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from './supabase.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function createClient() {
  // Pega os cookies da requisição atual do usuário
  const cookieStore = await cookies()

  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // O middleware do Next.js cuidará de atualizar as sessões expiradas
        }
      },
    },
  })
}

export function createBrowserClient() {
  return createSupabaseBrowserClient<Database>(supabaseUrl, supabaseKey)
}
