"use client"

import Button from "@/app/components/ui/Button/Button";
import { login, signup } from "@/app/services/auth/auth"
import { useState } from "react"
import "./styles.css"
import LoginForm from "../components/forms/LoginForm/LoginForm";

export default function Login() {
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  async function handleCreateAccount(formData: FormData) {
    setError(null)
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <main className="border w-full flex gap-4">
  <form action={handleSubmit} className={isCreating ? "w-1/2" : "w-full"}>
    <LoginForm />
    <Button className="mt-3" variant="primary" type="submit">Login</Button>
    <p className="mt-3 text-sm text-gray-500">Don&​apos;t have an account? <a href="#" onClick={() => setIsCreating(true)} className="text-blue-500">Register</a></p>
  </form>
  {
    isCreating && (
      <form action={handleCreateAccount} className="w-1/2">
        <LoginForm />
        <Button className="mt-3" variant="primary" type="submit">Create</Button>
        <Button className="mt-3" 
          variant="secondary" 
          type="button" 
          onClick={() => setIsCreating(false)}>
          Cancel
        </Button>
      </form>
    )
  }
</main>
      
    </div>
  )
}