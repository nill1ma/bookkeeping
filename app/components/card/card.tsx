"use client"

import './styles.css'

export default function CardContainer({children}: {children: React.ReactNode}) {
    return (
        <div className="card-container">
            {children}
        </div>
    )
}