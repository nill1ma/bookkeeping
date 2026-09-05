import { useMemo } from "react";
import { DetailsIncomingData } from "@/app/services/incomings/incomings.types";
import { DetailsIncomingData as DetailsExpenseData } from "@/app/services/expenses/expenses.types";

export function useTransactionCharts(
  dataIncomings?: DetailsIncomingData[],
  dataExpenses?: DetailsExpenseData[],
) {
  const charts = useMemo(() => {
      const incomings = dataIncomings?.reduce((acc, item) => acc + (item?.value || 0), 0) ?? 0;
      const expenses = dataExpenses?.reduce((acc, item) => acc + (item?.value || 0), 0) ?? 0;
  
      return {
        incomingChartData: incomings,
        expenseChartData: expenses,
        netIncome: incomings - expenses,
      };
    }, [dataIncomings, dataExpenses]);

  return charts;
}