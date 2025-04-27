
import { Store } from "@/contexts/StoreContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StoresListProps {
  stores: Store[];
  onEdit: (store: Store) => void;
  onDelete: (store: Store) => void;
}

const StoresList = ({ stores, onEdit, onDelete }: StoresListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stores.map((store) => (
        <Card key={store.id} className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-lg">{store.name}</CardTitle>
            {store.address && (
              <CardDescription>{store.address}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-4">
            {store.phone && (
              <p className="text-sm text-muted-foreground">
                Telefone: {store.phone}
              </p>
            )}
          </CardContent>
          <CardFooter className="bg-muted/30 flex justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(store)}
            >
              Editar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-500"
              onClick={() => onDelete(store)}
            >
              Excluir
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default StoresList;
