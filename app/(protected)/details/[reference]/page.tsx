
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

export default function Details() {

     const [incomingData, setIncomingData] = useState<any[]>([]);
     
     const [expenseData, setExpenseData] = useState<any[]>([]);
     
     const { setLoading, Loading } = useLoading();
     const params = useParams();
     const reference = decodeURIComponent(params.reference as string);
     useEffect(() => {
          async function loadData() {
            try {
              setLoading(true);
              // In list page - make calls in parallel
              const [incomings, expenses] = await Promise.all([
                getIncomingByReference(reference),
                getExpenseByReference(reference)
              ]);
      
              setIncomingData(incomings);
              setExpenseData(expenses);
            } catch (error) {
              console.error(error);
            } finally {
              setLoading(false);
            }
        }
        loadData();
      }, [reference]);

      if(Loading) {
        return <Loading />;
      }
    
    return (
      <div>
        <FormattedMessage id="details.reference" values={{ reference }} />
        <h3><FormattedMessage id="details.incomings" /></h3>
        <CardContainer>
            {incomingData.map((item) => {
              return <CardItem key={`${item.id}`} label={item.origin} value={item.value} />;
            })}
        </CardContainer>
        <h3><FormattedMessage id="details.expenses" /></h3>
        <CardContainer>
            {expenseData.map((item) => {
                return <CardItem key={`${item.id}`} label={item.destination} value={item.value} />;
            })}
        </CardContainer>
      </div>
    );
}