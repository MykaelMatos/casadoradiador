
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
import { useStore, Store } from "@/contexts/StoreContext";
import { toast } from "sonner";

const StoreManagement = () => {
  const { stores, updateStore, deleteStore } = useStore();
  const [isStoreDialogOpen, setIsStoreDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [storeForm, setStoreForm] = useState({
    id: "",
    name: "",
    address: "",
    phone: ""
  });

  const openEditStoreDialog = (store: Store) => {
    setStoreForm({
      id: store.id,
      name: store.name,
      address: store.address || "",
      phone: store.phone || ""
    });
    setCurrentStore(store);
    setIsStoreDialogOpen(true);
  };

  const openDeleteStoreDialog = (store: Store) => {
    setCurrentStore(store);
    setIsDeleteDialogOpen(true);
  };

  const handleStoreFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStoreForm({
      ...storeForm,
      [name]: value
    });
  };

  const handleSaveStore = () => {
    if (!storeForm.name) {
      toast.error("Nome da loja é obrigatório");
      return;
    }

    updateStore({
      id: storeForm.id,
      name: storeForm.name,
      address: storeForm.address,
      phone: storeForm.phone
    });

    toast.success(`Loja ${storeForm.name} atualizada com sucesso!`);
    setIsStoreDialogOpen(false);
  };

  const handleDeleteStore = () => {
    if (currentStore) {
      deleteStore(currentStore.id);
      toast.success(`Loja ${currentStore.name} excluída com sucesso!`);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Lojas</CardTitle>
        <CardDescription>
          Edite ou exclua lojas registradas no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                  onClick={() => openEditStoreDialog(store)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500"
                  onClick={() => openDeleteStoreDialog(store)}
                >
                  Excluir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>

      {/* Dialog para editar loja */}
      <Dialog open={isStoreDialogOpen} onOpenChange={setIsStoreDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsStoreDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveStore}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar exclusão de loja */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Loja</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. Todos os dados associados a esta loja serão removidos.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              Tem certeza que deseja excluir a loja <strong>{currentStore?.name}</strong>?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteStore}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default StoreManagement;
