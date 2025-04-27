
import * as XLSX from 'xlsx';
import { Product } from './stockUtils';
import { toast } from "sonner";

interface ExcelProduct {
  Código: string | number;
  Descrição: string;
  Marca: string;
  QTD: number;
  "R$ Compra": number;
}

export const exportToExcel = (products: Product[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    products.map(product => ({
      'Código': product.code,
      'Descrição': product.name,
      'Marca': product.supplier || '',
      'QTD': product.quantity,
      'R$ Compra': product.costPrice
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Estoque");
  
  XLSX.writeFile(workbook, `estoque_${new Date().toISOString().split('T')[0]}.xlsx`);
  toast.success("Planilha exportada com sucesso!");
};

export const importFromExcel = async (file: File): Promise<Partial<Product>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<ExcelProduct>(worksheet);
        
        const products: Partial<Product>[] = jsonData.map(row => ({
          code: String(row['Código']),
          name: row['Descrição'],
          supplier: row['Marca'],
          quantity: row['QTD'],
          costPrice: row['R$ Compra']
        }));
        
        resolve(products);
      } catch (error) {
        reject(new Error('Erro ao processar arquivo Excel'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo Excel'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
