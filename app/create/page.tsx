"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createIncoming } from "@/app/services/incomings/incomings"
import "./styles.css"
// Use your Supabase types for validation
const incomingSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  value: z.number().min(0, "Value must be positive"),
  reference: z.string().min(1, "Reference is required"),
})

type IncomingFormData = z.infer<typeof incomingSchema>

export default function CreateIncomingForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<IncomingFormData>({
    resolver: zodResolver(incomingSchema)
  })

  const onSubmit = async (data: IncomingFormData) => {
    try {
      await createIncoming(data)
      // Handle success
    } catch (error) {
      // Handle error
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="origin">Origin</label>
      <input id="origin" {...register("origin")} />
      {errors.origin && <span>{errors.origin.message}</span>}
      <label htmlFor="reference">Reference</label>
      <input id="reference" type="text" {...register("reference")} />
      {errors.reference && <span>{errors.reference.message}</span>}
      <label htmlFor="value">Value</label>
      <input id="value" type="number" {...register("value", { valueAsNumber: true })} />
      {errors.value && <span>{errors.value.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  )
}