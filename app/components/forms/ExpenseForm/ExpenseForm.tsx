"use client"
import Loading from "@/app/components/loading/loading"
import { useExpenses } from "@/app/hooks/useExpenses/useExpenses"
import { FormattedMessage, useIntl } from "react-intl"
import { z } from "zod"
import Button from "../../ui/Button/Button"
import Input from "../../ui/Input/Input"
import { useFormHandler } from "../useFormHandler"

const expenseSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  value: z.number().min(0, "Value must be positive"),
  reference: z.string().min(1, "Reference is required"),
})

export default function ExpenseForm({ onSuccess }: { onSuccess?: () => void }) {
  const { formatMessage } = useIntl()
  const { createMutation, isCreating } = useExpenses()
  const { register, handleSubmit, getErrorMessage } = useFormHandler(
    expenseSchema,
    async (data) => {
      createMutation(data)
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
      
      <Button className="button" variant="primary" type="submit" disabled={isCreating}>
        {isCreating ? <Loading /> : <FormattedMessage id="create.update.submit" />}
      </Button>
    </form>
  )
}