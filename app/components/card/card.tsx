"use client"

import './styles.css'

export default function CardContainer({children, className}: {children: React.ReactNode, className?: string}) {
    return (
        <div className={`card-container ${className || ''}`}>
            {children}
        </div>
    )
}