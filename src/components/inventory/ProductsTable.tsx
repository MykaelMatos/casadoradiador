
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Product } from "@/utils/stockUtils";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ products, onEdit, onDelete }) => {
  const getStockStatus = (product: Product) => {
    if (product.quantity === 0) return "empty";
    if (product.quantity <= product.minQuantity) return "low";
    return "normal";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead className="hidden md:table-cell">Categoria</TableHead>
          <TableHead className="text-right">Preço de Custo</TableHead>
          <TableHead className="text-right">Quantidade</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              Nenhum produto encontrado.
            </TableCell>
          </TableRow>
        ) : (
          products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.code}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell className="hidden md:table-cell">{product.category || "-"}</TableCell>
              <TableCell className="text-right">
                {product.costPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </TableCell>
              <TableCell className="text-right">{product.quantity}</TableCell>
              <TableCell className="text-center">
                {getStockStatus(product) === "empty" && (
                  <span className="alert-badge alert-badge-empty">Zerado</span>
                )}
                {getStockStatus(product) === "low" && (
                  <span className="alert-badge alert-badge-low">Baixo</span>
                )}
                {getStockStatus(product) === "normal" && (
                  <span className="alert-badge bg-inventory-normal text-white">Ok</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(product)}>Editar</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDelete(product)}
                      className="text-red-600"
                    >
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ProductsTable;
