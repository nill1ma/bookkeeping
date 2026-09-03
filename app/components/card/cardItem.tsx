"use client"

import './styles.css'


export default function CardItem({label, value, className}: {label: string, value: string, className?: string}) {
    return (
        <div className={`card-item ${className || ''}`}>
            <label className="label">{label}:</label>
            <span>{value}</span>
        </div>
    )
}