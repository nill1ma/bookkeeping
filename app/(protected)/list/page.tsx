"use client";
import * as Table from "@/app/components/ui/table/Table";
import { useLoading } from "@/app/hooks/useLoading/useLoading";
import { getIncomingsExpensesTransactions } from "@/app/services/incomings_expenses_transactions/incomings_expenses_transactions";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import "./styles.css";
import { IncomingsExpensesTransaction } from "@/app/services/incomings_expenses_transactions/incomings_expenses_transactions.types";
import CellContent from "./Components/CellComponent";

export default function List() {
    const columns = [
      { key: 'reference', label: 'Reference' },
      { key: 'incoming_value', label: 'Incomings' },
      { key: 'expense_value', label: 'Expenses' },
      { key: 'net_income', label: 'Net Income' },
    ]

    const [data, setData] = useState<IncomingsExpensesTransaction[]>([]);
    const { setLoading, Loading } = useLoading();

    useEffect(() => {
      async function loadData() {
        try {
          setLoading(true);
          const response = await getIncomingsExpensesTransactions()
          
          setData(response);
        } catch (error) {
          console.error('Error loading data:', error);
          // Handle error - maybe show error message
        } finally {
          setLoading(false);
        }
      }
      loadData();
    }, []);

 
  if (Loading) {
    return <Loading />;
  }

  if(data && data.length === 0) {
    return <div className="flex items-center justify-center h-full">No data</div>;
  }
  
  return (
    <>
      <Table.Table className="table">
        <Table.TableHeader className="table-header">
          <Table.TableRow className="table-row">
            {columns.map((column) => (
              <Table.TableCell key={column.key} className="table-cell">{column.label}</Table.TableCell>
            ))}
          </Table.TableRow>
        </Table.TableHeader>
        <Table.TableBody>
          {data.map((item) => (
            <Table.TableRow 
            onClick={() => redirect(`/details/${encodeURIComponent(item.reference)}`)} 
            key={item.id} 
            className="table-row">
            {columns.map((column) => (
                <CellContent
                  column={column}
                  item={item}
                  className="table-cell"
                  key={column.key}
                />
            ))}
          </Table.TableRow>
          ))}
        </Table.TableBody>
      </Table.Table>
    </>
  );
}
