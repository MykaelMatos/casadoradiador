
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store } from "@/contexts/StoreContext";

interface StoreFormState {
  id: string;
  name: string;
  address: string;
  phone: string;
}

interface StoreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  storeForm: StoreFormState;
  handleStoreFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StoreDialog = ({
  isOpen,
  onClose,
  onSave,
  storeForm,
  handleStoreFormChange,
}: StoreDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Loja</DialogTitle>
          <DialogDescription>
            Atualize as informações da loja.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Loja</Label>
            <Input
              id="name"
              name="name"
              value={storeForm.name}
              onChange={handleStoreFormChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              name="address"
              value={storeForm.address}
              onChange={handleStoreFormChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              name="phone"
              value={storeForm.phone}
              onChange={handleStoreFormChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StoreDialog;
