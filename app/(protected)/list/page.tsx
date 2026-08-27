import * as Table from "@/app/components/ui/table/Table";
import { getIncomings } from "@/app/services/incomings/incomings";
import { getExpenses } from "@/app/services/expenses/expenses";
import "./styles.css";
import { aggregateByReference } from "./utils";

export default async function List() {
    const columns = [
      { key: 'origin', label: 'Incoming Origin' },
      { key: 'incoming_value', label: 'Incomings' },
      { key: 'destination', label: 'Expense Description' },
      { key: 'expense_value', label: 'Expenses' },
      { key: 'net_income', label: 'Net Income' },
    ]

    const incomings = await getIncomings();
    const expenses = await getExpenses();

    const data = aggregateByReference(incomings || [], expenses || []);
 
   
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
        {data && data.length > 0 ? data.map((item: any) => (
        <Table.TableRow key={item.reference} className="table-row">
          {columns.map((column) => (
            <Table.TableCell key={column.key} className="table-cell">{item[column.key as keyof typeof item]}</Table.TableCell>
          ))}
        </Table.TableRow>
        )) : <Table.TableRow><Table.TableCell colSpan={columns.length} className="table-cell">No data</Table.TableCell></Table.TableRow>}
      </Table.TableBody>
    </Table.Table>
  );
}
