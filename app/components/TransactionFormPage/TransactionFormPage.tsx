"use client";

import { ExpenseForm, IncomingForm } from "@/app/components/forms";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import "./styles.css";

type TransactionType = "incomings" | "expenses";

interface TransactionFormPageProps {
  mode: "create" | "edit";
  type?: TransactionType;   // obrigatório no edit; ignorado no create
  id?: string;
  initialData?: Record<string, unknown>;
  redirectTo?: string;
}

export default function TransactionFormPage({
  mode,
  type,
  id,
  initialData,
  redirectTo = "/list",
}: TransactionFormPageProps) {
  const [controlTab, setControlTab] = useState<TransactionType>("incomings");
  const router = useRouter();

  // No create, quem manda é a aba clicada. No edit, quem manda é o type que veio por prop.
  const activeType = mode === "create" ? controlTab : type!;

  const handleSuccess = () => {
    router.push(redirectTo);
  };

  const titleId = {
  create: {
    incomings: "create.title.incomings",
    expenses: "create.title.expenses",
  },
  edit: {
    incomings: "update.title.incomings",
    expenses: "update.title.expenses",
  },
}[mode][activeType];

  return (
    <>
      {mode === "create" && (
        <nav>
          <ul className="tabs">
            <li
              className={`tab ${controlTab === "incomings" ? "active" : ""}`}
              onClick={() => setControlTab("incomings")}
            >
              <FormattedMessage id="create.update.tab.incomings" />
            </li>
            <li
              className={`tab ${controlTab === "expenses" ? "active" : ""}`}
              onClick={() => setControlTab("expenses")}
            >
              <FormattedMessage id="create.update.tab.expenses" />
            </li>
          </ul>
        </nav>
      )}

      <h1 className="title">
        <FormattedMessage
          id={titleId}
        />
      </h1>

      {activeType === "incomings" ? (
        <IncomingForm id={id} defaultValues={initialData as { value: number; reference: string; origin: string }} onSuccess={handleSuccess} />
      ) : (
        <ExpenseForm id={id} defaultValues={initialData as { destination: string; value: number; reference: string }} onSuccess={handleSuccess} />
      )}
    </>
  );
}