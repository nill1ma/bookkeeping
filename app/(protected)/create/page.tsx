"use client";

import { useState } from "react";
import "./styles.css";
import { IncomingForm, ExpenseForm } from "@/app/components/forms";
import { useRouter } from "next/navigation";
import { FormattedDate, FormattedMessage } from "react-intl";

export default function CreateForm() {
  const [controlTab, setControlTab] = useState<string>("incomings");
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/list");
  };

  return (
    <>
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
      <h1 className="title">
        <FormattedMessage
          id={
            controlTab === "incomings"
              ? "create.update.title.incomings"
              : "create.update.title.expenses"
          }
        />
      </h1>
      {controlTab === "incomings" ? (
        <IncomingForm onSuccess={handleSuccess} />
      ) : (
        <ExpenseForm onSuccess={handleSuccess} />
      )}
    </>
  );
}