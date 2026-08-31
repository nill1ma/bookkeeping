
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getIncomingByReference } from "@/app/services/incomings/incomings";
import { getExpenseByReference } from "@/app/services/expenses/expenses";
import CardContainer from "@/app/components/card/card";
import CardItem from "@/app/components/card/cardItem";
import "./styles.css";
import { useLoading } from "@/app/hooks/useLoading/useLoading";

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
        Reference: {reference}
        <h3>Incomings:</h3>
        <CardContainer>
            {incomingData.map((item) => {
                return Object.keys(item).filter(prop => prop === 'origin' || prop === 'value' ).map((key) => {
                    return <CardItem className="flex-col-reverse" key={`${item.id}-${key}`} label={key} value={item[key]} />;
                });
            })}
        </CardContainer>
        <h3>Expenses:</h3>
        <CardContainer>
            {expenseData.map((item) => {
                return Object.keys(item).filter(prop => prop === 'destination' || prop === 'value').map((key) => {
                    return <CardItem key={`${item.id}-${key}`} label={key} value={item[key]} />;
                });
            })}
        </CardContainer>
      </div>
    );
}