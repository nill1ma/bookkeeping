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
      <label className={labelClassName || ""}>{label}</label>
      <input className={inputClassName} {...props} />
    </div>
  );
}