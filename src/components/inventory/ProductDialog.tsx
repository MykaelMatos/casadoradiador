
import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Product } from "@/utils/stockUtils";

interface ProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Omit<Product, 'id' | 'storeId' | 'lastUpdated'>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  isNewProduct: boolean;
}

const ProductDialog: React.FC<ProductDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onInputChange,
  onSave,
  isNewProduct
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isNewProduct ? "Novo Produto" : "Editar Produto"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">Código</Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={onInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nome</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Descrição</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={onInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Categoria</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={onInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier" className="text-right">Fornecedor</Label>
            <Input
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={onInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="costPrice" className="text-right">Preço de Custo</Label>
            <Input
              id="costPrice"
              name="costPrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.costPrice}
              onChange={onInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sellPrice" className="text-right">Preço de Venda</Label>
            <Input
              id="sellPrice"
              name="sellPrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.sellPrice}
              onChange={onInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">Quantidade</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={onInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="minQuantity" className="text-right">Qtd. Mínima</Label>
            <Input
              id="minQuantity"
              name="minQuantity"
              type="number"
              min="0"
              value={formData.minQuantity}
              onChange={onInputChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
