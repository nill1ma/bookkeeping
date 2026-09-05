"use client";

import BarChartComponent from "@/app/components/Chart/BarChart/BarChart";
import Loading from "@/app/components/loading/loading";
import { TransactionDetailsList } from "@/app/components/TransactionDetailsList/TransactionDetailsList";
import { useExpenses } from "@/app/hooks/useExpenses/useExpenses";
import { useTransactionCharts } from "@/app/hooks/useExpenses/useTransactionCharts/useTransactionCharts";
import { useIncomings } from "@/app/hooks/useIncomings/useIncomings";
import { useParams } from "next/navigation";
import { FormattedMessage } from "react-intl";
import ReferenceDate from "./ReferenceDate";
import "./styles.css";

export default function Details() {
  const params = useParams();
  const reference = decodeURIComponent(params.reference as string);

  const {data: dataIncomings, isLoading: isLoadingIncomings, deleteMutation: deleteIncomingMutation} = useIncomings(reference);
  const {data: dataExpenses, isLoading: isLoadingExpenses, deleteMutation: deleteExpenseMutation} = useExpenses(reference);
  const {incomingChartData, expenseChartData, netIncome} = useTransactionCharts(dataIncomings, dataExpenses);

  if (isLoadingIncomings || isLoadingExpenses) {
    return <Loading />;
  }

  return (
    <>
      <h3>
        <ReferenceDate reference={reference} />
      </h3>
      <div className="flex">
        <article className="flex gap-2">
          <div className="p-0">
            <h3>
              <FormattedMessage id="details.incomings" />
            </h3>
            <div className="h-full border">
              <TransactionDetailsList items={dataIncomings} labelKey={"origin"} onDelete={deleteIncomingMutation} />
            </div>
          </div>

          <div>
            <h3>
              <FormattedMessage id="details.expenses" />
            </h3>
            <div className="h-full border">
              <TransactionDetailsList items={dataExpenses} labelKey={"destination"} onDelete={deleteExpenseMutation} />
            </div>
          </div>
        </article>
        <BarChartComponent
          id="details"
          dataAxis={["Incomings", "Expenses", "Net Income"]}
          data={[incomingChartData, expenseChartData, netIncome]}
          className="w-full h-full"
        />
      </div>
    </>
  );
}