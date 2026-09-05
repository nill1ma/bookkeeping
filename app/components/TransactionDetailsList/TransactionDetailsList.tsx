import CardContainer from "@/app/components/card/card";
import CardItem from "@/app/components/card/cardItem";
import { DeleteForever, EditNote } from "@mui/icons-material";

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
              <EditNote className="cursor-pointer" />
              <DeleteForever onClick={() => onDelete(item.id)} className="cursor-pointer" />
            </div>
          </CardItem>
        );
      })}
    </CardContainer>
  );
}