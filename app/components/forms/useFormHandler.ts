// app/components/forms/useFormHandler.ts
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

export function useFormHandler<T extends z.ZodSchema>(
  schema: T,
  onSubmit: (data: z.infer<T>) => Promise<void>
) {
  type FormData = z.infer<T>
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  return {
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
    errors,
    getErrorMessage: (fieldName: keyof FormData) => {
      const error = errors[fieldName]
      return error?.message as string | undefined
    }
  }
}