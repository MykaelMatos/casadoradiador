
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
import { ArrowDown } from "lucide-react";

const StockExit = () => {
  const { currentStore } = useStore();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [document, setDocument] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (currentStore) {
      const storedProducts = localStorage.getItem("inventory_products");
      if (storedProducts) {
        const allProducts = JSON.parse(storedProducts);
        const filteredProducts = allProducts.filter(
          (p: Product) => p.storeId === currentStore.id && p.quantity > 0
        );
        setProducts(filteredProducts);
      }
    }
  }, [currentStore]);

  useEffect(() => {
    if (selectedProductId) {
      const product = products.find(p => p.id === selectedProductId);
      if (product) {
        setMaxQuantity(product.quantity);
        setQuantity(1);
      }
    }
  }, [selectedProductId, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId || quantity <= 0) {
      toast.error("Selecione um produto e informe uma quantidade válida");
      return;
    }
    
    if (quantity > maxQuantity) {
      toast.error(`Quantidade máxima disponível: ${maxQuantity}`);
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
      type: 'exit',
      quantity,
      price: product.sellPrice,
      date: new Date().toISOString(),
      documentNumber: document,
      reason,
      storeId: currentStore.id,
      userId: user.id,
      userName: user.name
    });

    // Atualizar a lista de produtos após a saída
    const storedProducts = localStorage.getItem("inventory_products");
    if (storedProducts) {
      const allProducts = JSON.parse(storedProducts);
      const filteredProducts = allProducts.filter(
        (p: Product) => p.storeId === currentStore.id && p.quantity > 0
      );
      setProducts(filteredProducts);
    }

    // Limpar formulário
    setSelectedProductId("");
    setQuantity(1);
    setMaxQuantity(0);
    setDocument("");
    setReason("");

    toast.success("Saída de estoque registrada com sucesso!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowDown className="text-red-500" />
          Saída de Estoque
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
                  <SelectLabel>Produtos Disponíveis</SelectLabel>
                  {products.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      Nenhum produto em estoque
                    </SelectItem>
                  ) : (
                    products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.code} - {product.name} (Disp: {product.quantity})
                      </SelectItem>
                    ))
                  )}
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
                max={maxQuantity}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              />
              {selectedProductId && (
                <p className="text-xs text-muted-foreground mt-1">
                  Disponível: {maxQuantity}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="document">Nº Documento</Label>
              <Input
                id="document"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                placeholder="Opcional"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo da Saída</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Venda, Uso interno, etc."
            />
          </div>
          
          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={!selectedProductId || quantity <= 0 || quantity > maxQuantity}>
              Registrar Saída
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StockExit;
