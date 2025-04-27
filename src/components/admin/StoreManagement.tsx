
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore, Store } from "@/contexts/StoreContext";
import { toast } from "sonner";
import StoresList from "./stores/StoresList";
import StoreDialog from "./stores/StoreDialog";
import DeleteStoreDialog from "./stores/DeleteStoreDialog";

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
        <StoresList
          stores={stores}
          onEdit={openEditStoreDialog}
          onDelete={openDeleteStoreDialog}
        />
      </CardContent>

      <StoreDialog
        isOpen={isStoreDialogOpen}
        onClose={() => setIsStoreDialogOpen(false)}
        onSave={handleSaveStore}
        storeForm={storeForm}
        handleStoreFormChange={handleStoreFormChange}
      />

      <DeleteStoreDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteStore}
        store={currentStore}
      />
    </Card>
  );
};

export default StoreManagement;
