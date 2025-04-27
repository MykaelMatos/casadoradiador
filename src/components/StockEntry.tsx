
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product, addStockMovement } from "@/utils/stockUtils";
import { useStore } from "@/contexts/StoreContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ArrowUp } from "lucide-react";

const StockEntry = () => {
  const { currentStore } = useStore();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitCost, setUnitCost] = useState(0);
  const [document, setDocument] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (currentStore) {
      const storedProducts = localStorage.getItem("inventory_products");
      if (storedProducts) {
        const allProducts = JSON.parse(storedProducts);
        setProducts(allProducts.filter((p: Product) => p.storeId === currentStore.id));
      }
    }
  }, [currentStore]);

  useEffect(() => {
    if (selectedProductId) {
      const product = products.find(p => p.id === selectedProductId);
      if (product) {
        setUnitCost(product.costPrice);
      }
    }
  }, [selectedProductId, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId || quantity <= 0) {
      toast.error("Selecione um produto e informe uma quantidade válida");
      return;
    }
    
    if (!currentStore || !user) {
      toast.error("Erro ao identificar loja ou usuário");
      return;
    }

    const product = products.find(p => p.id === selectedProductId);
    if (!product) {
      toast.error("Produto não encontrado");
      return;
    }

    addStockMovement({
      productId: selectedProductId,
      productName: product.name,
      type: 'entry',
      quantity,
      price: unitCost,
      date: new Date().toISOString(),
      documentNumber: document,
      reason,
      storeId: currentStore.id,
      userId: user.id,
      userName: user.name
    });

    // Atualizar a lista de produtos após a entrada
    const storedProducts = localStorage.getItem("inventory_products");
    if (storedProducts) {
      const allProducts = JSON.parse(storedProducts);
      setProducts(allProducts.filter((p: Product) => p.storeId === currentStore.id));
    }

    // Limpar formulário
    setSelectedProductId("");
    setQuantity(1);
    setUnitCost(0);
    setDocument("");
    setReason("");

    toast.success("Entrada de estoque registrada com sucesso!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUp className="text-inventory-normal" />
          Entrada de Estoque
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Produto</Label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Produtos</SelectLabel>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.code} - {product.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unitCost">Preço Unitário (R$)</Label>
              <Input
                id="unitCost"
                type="number"
                step="0.01"
                min="0"
                value={unitCost}
                onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="document">Nº Documento/NF</Label>
              <Input
                id="document"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                placeholder="Opcional"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Opcional"
              />
            </div>
          </div>
          
          <div className="pt-2">
            <Button type="submit" className="w-full">
              Registrar Entrada
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StockEntry;
