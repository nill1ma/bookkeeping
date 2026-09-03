import { InputHTMLAttributes } from "react";
import "./styles.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  inputClassName?: string;
  containerClassName?: string;
  labelClassName?: string;
};

export default function Input({ label, inputClassName, containerClassName, labelClassName, ...props }: InputProps) {
  return (
    <div className={`input-control ${containerClassName || ""}`}>
      <label htmlFor={props.id} className={labelClassName || ""}>{label}</label>
      <input id={props.id} className={inputClassName} {...props} />
    </div>
  );
}