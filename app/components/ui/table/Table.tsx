
import './styles.css';

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return <table className={`table ${className || ''}`}>{children}</table>;
}

export function TableHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <thead className={`${className || ''}`}>{children}</thead>;
}

export function TableBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tbody className={`${className || ''}`}>{children}</tbody>;
}

export function TableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tr className={`${className || ''}`}>{children}</tr>;
}

export function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`table-cell ${className || ''}`}>{children}</td>;
}
