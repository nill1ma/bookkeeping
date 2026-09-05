
import { useFormHandler } from "../useFormHandler";
import { createIncoming } from "@/app/services/incomings/incomings";
import { z } from "zod";
import Button from "../../ui/Button/Button";
import { FormattedMessage, useIntl } from "react-intl";
import Input from "../../ui/Input/Input";

const incomingSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  value: z.number().min(0, "Value must be positive"),
  reference: z.string().min(1, "Reference is required"),
});

export default function IncomingForm({ onSuccess }: { onSuccess?: () => void }) {
  const { formatMessage } = useIntl()
  const { register, handleSubmit, getErrorMessage } = useFormHandler(
      incomingSchema,
      async (data) => {
        await createIncoming(data)
        onSuccess?.()
      }
    )

  return (
    <form onSubmit={handleSubmit} className="form">
      
      <Input label={formatMessage({ id: "create.update.incomings.origin" })} id="origin" className="input" {...register("origin")} />
      {getErrorMessage("origin") && <span>{getErrorMessage("origin")}</span>}
      
      <Input label={formatMessage({ id: "create.update.reference" })} id="reference" type="month" className="input" {...register("reference")} />
      {getErrorMessage("reference") && <span>{getErrorMessage("reference")}</span>}
     
      <Input label={formatMessage({ id: "create.update.value" })} id="value" type="number" className="input" {...register("value", { valueAsNumber: true })} />
      {getErrorMessage("value") && <span>{getErrorMessage("value")}</span>}
      <Button className="button" variant="primary" type="submit">
        <FormattedMessage id="create.update.submit" />
      </Button>
    </form>
  )
}