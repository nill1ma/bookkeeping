"use client"
import { useState } from "react"
import "./styles.css"
import { IncomingForm, ExpenseForm } from "@/app/components/forms"
import { redirect } from "next/navigation"

export default function CreateForm() {
  const [controlTab, setControlTab] = useState<string>("incomings")

  const handleSuccess = () => {
    redirect("/list")
  }


  return (
    <>
    <nav>
      <ul className="tabs">
        <li className={`tab ${controlTab === "incomings" ? "active" : ""}`} onClick={() => setControlTab("incomings")}>Incomings</li>
        <li className={`tab ${controlTab === "expenses" ? "active" : ""}`} onClick={() => setControlTab("expenses")}>Expenses</li>
      </ul>
    </nav>
    <h1>
      {controlTab === "incomings" ? "Incomings" : "Expenses"}
    </h1>
      {controlTab === "incomings" ? (
        <IncomingForm onSuccess={handleSuccess} />
      ) : (
        <ExpenseForm onSuccess={handleSuccess} />
      )}
    </>
  )
}