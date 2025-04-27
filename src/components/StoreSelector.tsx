
import { useStore, Store } from "@/contexts/StoreContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Box, Plus } from "lucide-react";

const StoreSelector = () => {
  const { stores, currentStore, setCurrentStore, addStore } = useStore();
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreAddress, setNewStoreAddress] = useState("");
  const [newStorePhone, setNewStorePhone] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddStore = () => {
    if (!newStoreName.trim()) {
      toast.error("Nome da loja é obrigatório");
      return;
    }
    
    addStore({
      name: newStoreName.trim(),
      address: newStoreAddress.trim(),
      phone: newStorePhone.trim()
    });

    setNewStoreName("");
    setNewStoreAddress("");
    setNewStorePhone("");
    setDialogOpen(false);
    
    toast.success("Nova loja adicionada com sucesso!");
  };

  const selectStore = (store: Store) => {
    setCurrentStore(store);
  };

  return (
    <div className="py-8 px-4 md:px-8">
      <h1 className="text-2xl font-bold mb-6">Selecione uma Loja</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores.map((store) => (
          <Card 
            key={store.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              currentStore?.id === store.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => selectStore(store)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Box className="mr-2 h-5 w-5" />
                {store.name}
              </CardTitle>
              {store.address && <CardDescription>{store.address}</CardDescription>}
            </CardHeader>
            <CardContent>
              {store.phone && <p className="text-sm text-muted-foreground mb-4">{store.phone}</p>}
              <Button 
                variant={currentStore?.id === store.id ? "default" : "outline"} 
                className="w-full"
                onClick={() => selectStore(store)}
              >
                {currentStore?.id === store.id ? "Selecionada" : "Selecionar"}
              </Button>
            </CardContent>
          </Card>
        ))}
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <Card className="cursor-pointer hover:bg-muted/50 transition-all flex flex-col items-center justify-center h-full">
            <DialogTrigger asChild>
              <div className="p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Adicionar Nova Loja</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Cadastre uma nova filial no sistema
                </p>
              </div>
            </DialogTrigger>
          </Card>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Loja</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Loja *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Filial Centro"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  placeholder="Ex: Rua Principal, 123"
                  value={newStoreAddress}
                  onChange={(e) => setNewStoreAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="Ex: (00) 12345-6789"
                  value={newStorePhone}
                  onChange={(e) => setNewStorePhone(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddStore}>Adicionar Loja</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StoreSelector;
