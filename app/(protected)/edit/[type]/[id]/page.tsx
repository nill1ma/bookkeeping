// app/(protected)/edit/[type]/[id]/page.tsx
"use client";

import Loading from "@/app/components/loading/loading";
import TransactionFormPage from "@/app/components/TransactionFormPage/TransactionFormPage";
import { useExpenses } from "@/app/hooks/useExpenses/useExpenses";
import { useIncomings } from "@/app/hooks/useIncomings/useIncomings";
import { useParams } from "next/navigation";

export default function EditPage() {
  const { type, id } = useParams<{ type: "incomings" | "expenses"; id: string }>();
  const isIncoming = type === "incomings";

  const { dataSingleIncoming, isLoadingSingleIncoming } = useIncomings(undefined, id);
  const { dataSingleExpense, isLoadingSingleExpense } = useExpenses(undefined, id);

  const isLoading = isIncoming ? isLoadingSingleIncoming : isLoadingSingleExpense;
  const initialData = isIncoming ? dataSingleIncoming : dataSingleExpense;

  if (isLoading) return <Loading />;

  return (
    <TransactionFormPage
      mode="edit"
      type={type}
      id={id}
      initialData={type === "incomings" ? dataSingleIncoming : dataSingleExpense}
      redirectTo={initialData?.reference ? `/details/${encodeURIComponent(initialData.reference)}` : "/list"}
    />
  );
}