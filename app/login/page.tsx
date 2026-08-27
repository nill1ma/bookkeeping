"use client"

import Input from "@/app/components/ui/Input/Input";
import Button from "@/app/components/ui/Button/Button";
import { login } from "@/app/services/auth/auth"
import { useState } from "react"

export default function Login() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form action={handleSubmit}>
        <Input 
          placeholder="user@example.com" 
          label="Email" 
          name="email" 
          type="email" 
          required
        />
        <Input 
          placeholder="password" 
          label="Password" 
          name="password" 
          type="password" 
          required
        />
        <Button variant="primary" type="submit">Login</Button>
      </form>
    </div>
  )
}