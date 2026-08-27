
import { useFormHandler } from "../useFormHandler";
import { createIncoming } from "@/app/services/incomings/incomings";
import { z } from "zod";
import Button from "../../ui/Button/Button";

const incomingSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  value: z.number().min(0, "Value must be positive"),
  reference: z.string().min(1, "Reference is required"),
});

export default function IncomingForm({ onSuccess }: { onSuccess?: () => void }) {
  
  const { register, handleSubmit, getErrorMessage } = useFormHandler(
      incomingSchema,
      async (data) => {
        await createIncoming(data)
        onSuccess?.()
      }
    )

  return (
    <form onSubmit={handleSubmit} className="form">
      <label htmlFor="origin">Origin</label>
      <input id="origin" className="input" {...register("origin")} />
      {getErrorMessage("origin") && <span>{getErrorMessage("origin")}</span>}
      
      <label htmlFor="reference">Reference</label>
      <input id="reference" type="text" className="input" {...register("reference")} />
      {getErrorMessage("reference") && <span>{getErrorMessage("reference")}</span>}
      
      <label htmlFor="value">Value</label>
      <input id="value" type="number" className="input" {...register("value", { valueAsNumber: true })} />
      {getErrorMessage("value") && <span>{getErrorMessage("value")}</span>}
      <Button className="button" variant="primary" type="submit">Submit</Button>
    </form>
  )
}