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

export default function Details() {
  const [incomingData, setIncomingData] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any[]>([]);
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
      <h3 className="p-2">
        <FormattedMessage id="details.reference" values={{ reference }} />
      </h3>
      <div className="flex h-[80%]">
        <article className="flex gap-2">
          <div>
            <h3>
              <FormattedMessage id="details.incomings" />
            </h3>
            <div className="h-full border border-gray-200">
              <CardContainer>
                {incomingData.map((item) => {
                  return (
                    <CardItem
                      key={`${item.id}`}
                      label={item.origin}
                      value={item.value}
                      className="h-[80%]"
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
            <div className="h-full border border-gray-200">
            <CardContainer>
              {expenseData.map((item) => {
                return (
                  <CardItem
                    key={`${item.id}`}
                    label={item.destination}
                    value={item.value}
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
        />
      </div>
    </>
  );
}