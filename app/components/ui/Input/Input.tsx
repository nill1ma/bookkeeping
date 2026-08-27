import { InputHTMLAttributes } from "react";
import "./styles.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  className?: string;
};

export default function Input({ label, className, ...props }: InputProps) {
  return (
    <div className="input-control">
      <label>{label}</label>
      <input className={className} {...props} />
    </div>
  );
}