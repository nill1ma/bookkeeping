"use client"

import './styles.css'

type CardItemProps = {
  label: string;
  value: string | number;
  className?: string;
  children?: React.ReactNode;
}


export default function CardItem({label, value, className, children}: CardItemProps) {
    return (
        <div className={`card-item border-b ${className || ''}`}>
            <label className="label">{label}:</label>
            <span>{value}</span>
            {children}
        </div>
    )
}