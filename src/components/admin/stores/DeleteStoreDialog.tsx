
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Store } from "@/contexts/StoreContext";

interface DeleteStoreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  store: Store | null;
}

const DeleteStoreDialog = ({
  isOpen,
  onClose,
  onConfirm,
  store,
}: DeleteStoreDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Loja</DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. Todos os dados associados a esta loja serão removidos.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>
            Tem certeza que deseja excluir a loja <strong>{store?.name}</strong>?
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStoreDialog;
