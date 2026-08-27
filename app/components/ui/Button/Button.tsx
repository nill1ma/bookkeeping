
import "./styles.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  cursor?: "pointer" | "default" | "not-allowed";
  className?: string;
};

export default function Button({ children, variant = "primary", cursor = "pointer", className = "" }: ButtonProps) {
  return <button className={`button button--${variant} cursor-${cursor} ${className}`}>{children}</button>;
}