"use client"
import { z } from "zod"
import { createExpense } from "@/app/services/expenses/expenses"
import { useFormHandler } from "../useFormHandler"
import Button from "../../ui/Button/Button"
import { FormattedMessage, useIntl } from "react-intl"
import Input from "../../ui/Input/Input"

const expenseSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  value: z.number().min(0, "Value must be positive"),
  reference: z.string().min(1, "Reference is required"),
})

export default function ExpenseForm({ onSuccess }: { onSuccess?: () => void }) {
  const { formatMessage } = useIntl()
  const { register, handleSubmit, getErrorMessage } = useFormHandler(
    expenseSchema,
    async (data) => {
      await createExpense(data)
      onSuccess?.()
    }
  )

  return (
    <form onSubmit={handleSubmit} className="form">
      <Input label={formatMessage({ id: "create.update.expenses.destination" })} {...register("destination")} className="input" />
      {getErrorMessage("destination") && <span>{getErrorMessage("destination")}</span>}
      
      <Input label={formatMessage({ id: "create.update.reference" })} type="month" {...register("reference")} className="input" />
      {getErrorMessage("reference") && <span>{getErrorMessage("reference")}</span>}
      
      <Input label={formatMessage({ id: "create.update.value" })} type="number" {...register("value", { valueAsNumber: true })} className="input" />
      {getErrorMessage("value") && <span>{getErrorMessage("value")}</span>}
      
      <Button className="button" variant="primary" type="submit">
        <FormattedMessage id="create.update.submit" />
      </Button>
    </form>
  )
}