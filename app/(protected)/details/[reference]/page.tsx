"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getIncomingByReference } from "@/app/services/incomings/incomings";
import { getExpenseByReference } from "@/app/services/expenses/expenses";
import CardContainer from "@/app/components/card/card";
import CardItem from "@/app/components/card/cardItem";
import "./styles.css";
import { useLoading } from "@/app/hooks/useLoading/useLoading";
import { FormattedMessage } from "react-intl";
import BarChartComponent from "@/app/components/Chart/BarChart/BarChart";
import ReferenceDate from "./ReferenceDate";
import { Incoming } from "@/app/services/incomings/incomings.types";
import { Expense } from "@/app/services/expenses/expenses.types";

export default function Details() {
  const [incomingData, setIncomingData] = useState<Pick<Incoming, 'id' | 'value' | 'origin'>[]>([]);
  const [expenseData, setExpenseData] = useState<Pick<Expense, 'id' | 'value' | 'destination'>[]>([]);
  const [charts, setCharts] = useState<{
    incomings: number;
    expenses: number;
    netIncome: number;
  }>({
    incomings: 0,
    expenses: 0,
    netIncome: 0,
  });
  const { setLoading, Loading } = useLoading();
  const params = useParams();
  const reference = decodeURIComponent(params.reference as string);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [incomings, expenses] = await Promise.all([
          getIncomingByReference(reference),
          getExpenseByReference(reference),
        ]);

        setIncomingData(incomings);
        setExpenseData(expenses);

        const charts = {
          incomings: incomings.reduce((acc, item) => acc + (item?.value || 0), 0),
          expenses: expenses.reduce((acc, item) => acc + (item?.value || 0), 0),
          netIncome: incomings.reduce((acc, item) => acc + (item?.value || 0), 0) -
            expenses.reduce((acc, item) => acc + (item?.value || 0), 0),
        };
        setCharts(charts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [reference, setLoading]);

  if (Loading) {
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
              <CardContainer>
                {incomingData.map((item) => {
                  return (
                    <CardItem
                      key={`${item.id}`}
                      label={item.origin}
                      value={item.value as string | number}
                      className="justify-between"
                    />
                  );
                })}
              </CardContainer>
            </div>
          </div>

          <div>
            <h3>
              <FormattedMessage id="details.expenses" />
            </h3>
            <div className="h-full border">
            <CardContainer>
              {expenseData.map((item) => {
                return (
                  <CardItem
                    key={`${item.id}`}
                    label={item.destination}
                    value={item.value as string | number}
                    className="justify-between"
                  />
                );
              })}
            </CardContainer>
            </div>
          </div>
        </article>
        <BarChartComponent
          id="details"
          dataAxis={["Incomings", "Expenses", "Net Income"]}
          data={[charts.incomings, charts.expenses, charts.netIncome]}
          className="w-full h-full"
        />
      </div>
    </>
  );
}