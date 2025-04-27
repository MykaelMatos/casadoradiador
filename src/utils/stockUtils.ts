
import { toast } from "sonner";

export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  costPrice: number;
  sellPrice: number;
  quantity: number;
  minQuantity: number;
  storeId: string;
  category?: string;
  supplier?: string;
  lastUpdated: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'entry' | 'exit';
  quantity: number;
  date: string;
  reason?: string;
  documentNumber?: string;
  price: number;
  storeId: string;
  userId: string;
  userName: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'approved' | 'delivered' | 'canceled';
  supplier: string;
  items: OrderItem[];
  totalValue: number;
  storeId: string;
  notes?: string;
  createdBy: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Local storage keys
const PRODUCTS_KEY = "inventory_products";
const MOVEMENTS_KEY = "inventory_movements";
const ORDERS_KEY = "inventory_orders";

// Funções auxiliares
const getStoreProducts = (storeId: string): Product[] => {
  const allProducts = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
  return allProducts.filter((p: Product) => p.storeId === storeId);
};

const getStoreMovements = (storeId: string): StockMovement[] => {
  const allMovements = JSON.parse(localStorage.getItem(MOVEMENTS_KEY) || "[]");
  return allMovements.filter((m: StockMovement) => m.storeId === storeId);
};

const getStoreOrders = (storeId: string): Order[] => {
  const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  return allOrders.filter((o: Order) => o.storeId === storeId);
};

// Funções de produtos
export const getProducts = (storeId: string): Product[] => {
  return getStoreProducts(storeId);
};

export const getProduct = (productId: string): Product | undefined => {
  const allProducts = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
  return allProducts.find((p: Product) => p.id === productId);
};

export const addProduct = (product: Omit<Product, "id">): Product => {
  const newProduct = {
    ...product,
    id: Math.random().toString(36).substr(2, 9),
    lastUpdated: new Date().toISOString(),
  };

  const allProducts = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
  allProducts.push(newProduct);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(allProducts));
  
  toast.success(`Produto ${newProduct.name} adicionado com sucesso!`);
  return newProduct;
};

export const updateProduct = (product: Product): void => {
  const allProducts = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
  const index = allProducts.findIndex((p: Product) => p.id === product.id);
  
  if (index !== -1) {
    allProducts[index] = {
      ...product,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(allProducts));
    toast.success(`Produto ${product.name} atualizado com sucesso!`);
  }
};

export const deleteProduct = (productId: string): void => {
  const allProducts = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
  const product = allProducts.find((p: Product) => p.id === productId);
  
  if (product) {
    const newProducts = allProducts.filter((p: Product) => p.id !== productId);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(newProducts));
    toast.success(`Produto ${product.name} removido com sucesso!`);
  }
};

// Funções de movimentação
export const addStockMovement = (movement: Omit<StockMovement, "id">): void => {
  const newMovement = {
    ...movement,
    id: Math.random().toString(36).substr(2, 9),
  };

  const allMovements = JSON.parse(localStorage.getItem(MOVEMENTS_KEY) || "[]");
  allMovements.push(newMovement);
  localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(allMovements));
  
  // Atualizar quantidade do produto
  const allProducts = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
  const productIndex = allProducts.findIndex((p: Product) => p.id === movement.productId);
  
  if (productIndex !== -1) {
    const updatedProduct = { ...allProducts[productIndex] };
    
    if (movement.type === 'entry') {
      updatedProduct.quantity += movement.quantity;
      toast.success(`Entrada de ${movement.quantity} unidades de ${movement.productName} registrada.`);
    } else {
      if (updatedProduct.quantity >= movement.quantity) {
        updatedProduct.quantity -= movement.quantity;
        toast.success(`Saída de ${movement.quantity} unidades de ${movement.productName} registrada.`);
      } else {
        toast.error(`Estoque insuficiente para ${movement.productName}`);
        return;
      }
    }
    
    updatedProduct.lastUpdated = new Date().toISOString();
    allProducts[productIndex] = updatedProduct;
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(allProducts));
  }
};

export const getStockMovements = (storeId: string, filter?: {
  startDate?: string;
  endDate?: string;
  type?: 'entry' | 'exit';
}): StockMovement[] => {
  let movements = getStoreMovements(storeId);
  
  if (filter) {
    if (filter.type) {
      movements = movements.filter(m => m.type === filter.type);
    }
    
    if (filter.startDate) {
      movements = movements.filter(m => new Date(m.date) >= new Date(filter.startDate!));
    }
    
    if (filter.endDate) {
      movements = movements.filter(m => new Date(m.date) <= new Date(filter.endDate!));
    }
  }
  
  return movements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Funções de pedidos
export const addOrder = (order: Omit<Order, "id">): Order => {
  const newOrder = {
    ...order,
    id: Math.random().toString(36).substr(2, 9),
  };

  const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  allOrders.push(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
  
  toast.success(`Pedido #${newOrder.id.substring(0, 6)} criado com sucesso!`);
  return newOrder;
};

export const updateOrder = (order: Order): void => {
  const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  const index = allOrders.findIndex((o: Order) => o.id === order.id);
  
  if (index !== -1) {
    allOrders[index] = order;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
    toast.success(`Pedido #${order.id.substring(0, 6)} atualizado com sucesso!`);
  }
};

export const getOrders = (storeId: string): Order[] => {
  return getStoreOrders(storeId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getAlerts = (storeId: string): Product[] => {
  const products = getStoreProducts(storeId);
  return products.filter(p => p.quantity <= p.minQuantity);
};

// Exportar dados em formato ODF (simulado como JSON para download)
export const generateReport = (data: any, reportType: string): void => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", `relatorio_${reportType}_${new Date().toISOString().split('T')[0]}.json`);
  a.click();
  
  URL.revokeObjectURL(url);
  toast.success("Relatório gerado com sucesso!");
};
