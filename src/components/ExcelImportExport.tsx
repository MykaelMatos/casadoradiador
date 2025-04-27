
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Import, Export } from "lucide-react";
import { exportToExcel, importFromExcel } from "@/utils/excelUtils";
import { Product, addProduct } from "@/utils/stockUtils";
import { useStore } from "@/contexts/StoreContext";
import { toast } from "sonner";

interface ExcelImportExportProps {
  products: Product[];
  onImportComplete: () => void;
}

const ExcelImportExport: React.FC<ExcelImportExportProps> = ({
  products,
  onImportComplete
}) => {
  const { currentStore } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentStore) return;

    try {
      const importedProducts = await importFromExcel(file);
      
      importedProducts.forEach(product => {
        if (product.code && product.name) {
          addProduct({
            code: product.code,
            name: product.name,
            description: "",
            costPrice: product.costPrice || 0,
            sellPrice: 0,
            quantity: product.quantity || 0,
            minQuantity: 0,
            storeId: currentStore.id,
            supplier: product.supplier,
            lastUpdated: new Date().toISOString()
          });
        }
      });

      toast.success("Produtos importados com sucesso!");
      onImportComplete();
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Erro ao importar arquivo");
    }
  };

  const handleExport = () => {
    if (products.length === 0) {
      toast.error("Não há produtos para exportar");
      return;
    }
    exportToExcel(products);
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImport}
      />
      
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2"
      >
        <Import className="h-4 w-4" />
        Importar Excel
      </Button>
      
      <Button
        variant="outline"
        onClick={handleExport}
        className="flex items-center gap-2"
      >
        <Export className="h-4 w-4" />
        Exportar Excel
      </Button>
    </div>
  );
};

export default ExcelImportExport;
