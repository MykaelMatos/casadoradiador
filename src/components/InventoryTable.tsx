
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product, addProduct, updateProduct, deleteProduct } from "@/utils/stockUtils";
import { useStore } from "@/contexts/StoreContext";
import { toast } from "sonner";
import ExcelImportExport from "./ExcelImportExport";
import ProductDialog from "./inventory/ProductDialog";
import DeleteProductDialog from "./inventory/DeleteProductDialog";
import ProductsTable from "./inventory/ProductsTable";

const InventoryTable = () => {
  const { currentStore } = useStore();
  const [products, setProducts] = useState<Product[]>(() => {
    if (!currentStore) return [];
    const storedProducts = localStorage.getItem("inventory_products");
    if (storedProducts) {
      const allProducts = JSON.parse(storedProducts);
      return allProducts.filter((p: Product) => p.storeId === currentStore.id);
    }
    return [];
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    costPrice: 0,
    sellPrice: 0,
    quantity: 0,
    minQuantity: 0,
    category: "",
    supplier: ""
  });

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openNewProductDialog = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      costPrice: 0,
      sellPrice: 0,
      quantity: 0,
      minQuantity: 0,
      category: "",
      supplier: ""
    });
    setCurrentProduct(null);
    setIsNewProduct(true);
    setIsDialogOpen(true);
  };

  const openEditProductDialog = (product: Product) => {
    setFormData({
      code: product.code,
      name: product.name,
      description: product.description || "",
      costPrice: product.costPrice,
      sellPrice: product.sellPrice,
      quantity: product.quantity,
      minQuantity: product.minQuantity,
      category: product.category || "",
      supplier: product.supplier || ""
    });
    setCurrentProduct(product);
    setIsNewProduct(false);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "costPrice" || name === "sellPrice" || name === "quantity" || name === "minQuantity"
        ? parseFloat(value)
        : value
    });
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.code) {
      toast.error("Nome e código são obrigatórios");
      return;
    }
    
    if (!currentStore) {
      toast.error("Nenhuma loja selecionada");
      return;
    }

    if (isNewProduct) {
      const newProduct = addProduct({
        ...formData,
        storeId: currentStore.id,
        lastUpdated: new Date().toISOString()
      });
      
      setProducts([...products, newProduct]);
    } else if (currentProduct) {
      updateProduct({
        ...currentProduct,
        ...formData
      });
      
      setProducts(products.map(p => 
        p.id === currentProduct.id ? { ...p, ...formData } : p
      ));
    }

    setIsDialogOpen(false);
  };

  const handleDeleteProduct = () => {
    if (currentProduct) {
      deleteProduct(currentProduct.id);
      setProducts(products.filter(p => p.id !== currentProduct.id));
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/3">
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <ExcelImportExport 
            products={products}
            onImportComplete={() => {
              if (currentStore) {
                const storedProducts = localStorage.getItem("inventory_products");
                if (storedProducts) {
                  const allProducts = JSON.parse(storedProducts);
                  setProducts(allProducts.filter((p: Product) => p.storeId === currentStore.id));
                }
              }
            }}
          />
          <Button onClick={openNewProductDialog}>Novo Produto</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <ProductsTable 
            products={filteredProducts}
            onEdit={openEditProductDialog}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      <ProductDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        formData={formData}
        onInputChange={handleInputChange}
        onSave={handleSaveProduct}
        isNewProduct={isNewProduct}
      />

      <DeleteProductDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        product={currentProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default InventoryTable;
