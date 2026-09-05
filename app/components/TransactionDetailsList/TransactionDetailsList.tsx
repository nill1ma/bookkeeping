import CardContainer from "@/app/components/card/card";
import CardItem from "@/app/components/card/cardItem";
import { DeleteForever, EditNote } from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface Transaction {
  id: string;
  value: string | number | null;
  [key: string]: unknown;
}

interface TransactionListProps<T extends Transaction> {
  items: T[] | undefined;
  labelKey: keyof T;
  onDelete: (id: string) => void;
}

export function TransactionDetailsList<T extends Transaction>({
  items,
  labelKey,
  onDelete
}: TransactionListProps<T>) {
  const router = useRouter();
  const mountRout = (item: string[]) => item.includes('origin') ? 'incomings' : 'expenses'
  return (
    <CardContainer>
      {items?.map((item) => {
        return (
          <CardItem
            key={`${item.id}`}
            label={item[labelKey] as string}
            value={item.value as string | number}
            className="justify-between"
          >
            <div>
              <EditNote onClick={() => router.push(`/edit/${mountRout(Object.keys(item))}/${item.id}`)} className="cursor-pointer" />
              <DeleteForever onClick={() => onDelete(item.id)} className="cursor-pointer" />
            </div>
          </CardItem>
        );
      })}
    </CardContainer>
  );
}