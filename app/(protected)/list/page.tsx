"use client";
import * as Table from "@/app/components/ui/table/Table";
import { getIncomings } from "@/app/services/incomings/incomings";
import { getExpenses } from "@/app/services/expenses/expenses";
import "./styles.css";
import { aggregateByReference } from "./utils";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function List() {
    const columns = [
      { key: 'reference', label: 'Reference' },
      { key: 'incoming_value', label: 'Incomings' },
      { key: 'expense_value', label: 'Expenses' },
      { key: 'net_income', label: 'Net Income' },
    ]

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadData() {
        const incomings = await getIncomings();
        const expenses = await getExpenses();

        const aggregated = aggregateByReference(incomings || [], expenses || []);
        setData(aggregated);
        setLoading(false);
      }
      loadData();
    }, []);

    if(loading) {
      return <div>Loading...</div>;
    }
 
   
  return (
    <Table.Table className="table">
      <Table.TableHeader className="table-header">
        <Table.TableRow className="table-row">
          {columns.map((column) => (
            <Table.TableCell key={column.key} className="table-cell">{column.label}</Table.TableCell>
          ))}
        </Table.TableRow>
      </Table.TableHeader>
      <Table.TableBody>
        {data && data.length > 0 && data.map((item: any) => (
        
        <Table.TableRow 
        onClick={() => redirect(`/details/${encodeURIComponent(item.reference)}`)} key={item.reference} className="table-row">
          {columns.map((column) => (
            <Table.TableCell key={column.key} className="table-cell">
              {item[column.key as keyof typeof item]}</Table.TableCell>
          ))}
        </Table.TableRow>
        
      ))}

      </Table.TableBody>
    </Table.Table>
  );
}
