"use client"

import './styles.css'


export default function CardItem({label, value, className}: {label: string, value: string, className?: string}) {
    return (
        <div className={`card-item border-b ${className || ''}`}>
            <label className="label">{label}:</label>
            <span>{value}</span>
        </div>
    )
}