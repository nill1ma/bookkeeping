
import "./styles.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  cursor?: "pointer" | "default" | "not-allowed";
  className?: string;
  onClick?: () => void;
};

export default function Button({ children, variant = "primary", cursor = "pointer", className = "", onClick }: ButtonProps) {
  return <button onClick={onClick} className={`button button--${variant} cursor-${cursor} ${className}`}>{children}</button>;
}