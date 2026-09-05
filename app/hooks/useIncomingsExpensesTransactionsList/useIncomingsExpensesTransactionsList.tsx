import { getIncomingsExpensesTransactions } from "@/app/services/incomings_expenses_transactions/incomings_expenses_transactions";
import { useQuery } from "@tanstack/react-query";
import { IncomingsExpensesTransaction } from "@/app/services/incomings_expenses_transactions/incomings_expenses_transactions.types";

export function useIncomingsExpensesTransactionsList() {
  const { data, isLoading } = useQuery<IncomingsExpensesTransaction[]>({
    queryKey: ['incomings-expenses-transactions'],
    queryFn: () => getIncomingsExpensesTransactions(),
  });
  return {
    data,
    isLoading,
  };
}