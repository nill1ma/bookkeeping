import Input from "@/app/components/ui/Input/Input";
import { fields } from "./constants";
import { FormattedMessage, useIntl } from "react-intl";

type LoginFormProps = {
  action?: (formData: FormData) => Promise<void>;
  children?: React.ReactNode;
  formClassName?: string;
  articleClassName?: string;
  formattedMessageCardTitle?: string;
  isCreating?: boolean;
}

export default function LoginForm({action, children, formClassName, articleClassName, formattedMessageCardTitle, isCreating, ...props}: LoginFormProps) { 
  const {formatMessage} = useIntl();
  return (
    
    <article className={`flex-col gap-4 p-5 ${articleClassName || ''}`}>
        <FormattedMessage id={formattedMessageCardTitle} />
        <form action={action} className={`w-full ${formClassName || ''}`}>
            {fields.map((field) => {
             const name = isCreating ? `signup-${field.name}` : field.name;
             return <Input
                      {...props}
                      key={name}
                      id={name}
                      placeholder={formatMessage({id: field.placeholder})} 
                      label={formatMessage({id: field.label})} 
                      name={name} 
                      type={field.type} 
                      required={field.required}
                      containerClassName={field.containerClassName}
                    />
              })}
            {children}
        </form>
    </article>
    
  )
}