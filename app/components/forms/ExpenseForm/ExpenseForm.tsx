"use client"
import { z } from "zod"
import { createExpense } from "@/app/services/expenses/expenses"
import { useFormHandler } from "../useFormHandler"
import Button from "../../ui/Button/Button"

const expenseSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  value: z.number().min(0, "Value must be positive"),
  reference: z.string().min(1, "Reference is required"),
})

export default function ExpenseForm({ onSuccess }: { onSuccess?: () => void }) {
  const { register, handleSubmit, getErrorMessage } = useFormHandler(
    expenseSchema,
    async (data) => {
      await createExpense(data)
      onSuccess?.()
    }
  )

  return (
    <form onSubmit={handleSubmit} className="form">
      <label>Destination</label>
      <input {...register("destination")} className="input" />
      {getErrorMessage("destination") && <span>{getErrorMessage("destination")}</span>}
      
      <label>Reference</label>
      <input {...register("reference")} className="input" />
      {getErrorMessage("reference") && <span>{getErrorMessage("reference")}</span>}
      
      <label>Value</label>
      <input type="number" {...register("value", { valueAsNumber: true })} className="input" />
      {getErrorMessage("value") && <span>{getErrorMessage("value")}</span>}
      
      <Button className="button" variant="primary" type="submit">Submit</Button>
    </form>
  )
}