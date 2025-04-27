
import { useState, useEffect } from "react";
import { useStore } from "@/contexts/StoreContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Order,
  OrderItem,
  Product,
  getOrders,
  addOrder,
  updateOrder,
} from "@/utils/stockUtils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

const OrdersList = () => {
  const { currentStore } = useStore();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [supplier, setSupplier] = useState("");
  const [notes, setNotes] = useState("");

  // Carregar pedidos e produtos
  useEffect(() => {
    if (currentStore) {
      setOrders(getOrders(currentStore.id));
      
      const storedProducts = localStorage.getItem("inventory_products");
      if (storedProducts) {
        const allProducts = JSON.parse(storedProducts);
        setProducts(
          allProducts.filter((p: Product) => p.storeId === currentStore.id)
        );
      }
    }
  }, [currentStore]);

  const handleAddItem = () => {
    if (!selectedProductId || quantity <= 0) {
      toast.error("Selecione um produto e uma quantidade válida");
      return;
    }

    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const existingItem = orderItems.find(item => item.productId === selectedProductId);
    
    if (existingItem) {
      setOrderItems(
        orderItems.map(item =>
          item.productId === selectedProductId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                totalPrice: (item.quantity + quantity) * item.unitPrice,
              }
            : item
        )
      );
    } else {
      const newItem: OrderItem = {
        productId: selectedProductId,
        productName: product.name,
        quantity,
        unitPrice: product.costPrice,
        totalPrice: quantity * product.costPrice,
      };
      setOrderItems([...orderItems, newItem]);
    }

    setSelectedProductId("");
    setQuantity(1);
    toast.success("Item adicionado ao pedido");
  };

  const handleRemoveItem = (productId: string) => {
    setOrderItems(orderItems.filter(item => item.productId !== productId));
  };

  const handleCreateOrder = () => {
    if (!orderItems.length) {
      toast.error("Adicione pelo menos um item ao pedido");
      return;
    }

    if (!supplier) {
      toast.error("Informe o fornecedor");
      return;
    }

    if (!currentStore || !user) {
      toast.error("Erro ao identificar loja ou usuário");
      return;
    }

    const totalValue = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const newOrder: Omit<Order, "id"> = {
      date: new Date().toISOString(),
      status: 'pending',
      supplier,
      items: orderItems,
      totalValue,
      storeId: currentStore.id,
      notes,
      createdBy: user.name,
    };

    addOrder(newOrder);
    setOrders(getOrders(currentStore.id));
    
    // Limpar formulário
    setOrderItems([]);
    setSupplier("");
    setNotes("");
    setIsDialogOpen(false);
    
    toast.success("Pedido criado com sucesso!");
  };

  const updateOrderStatus = (order: Order, newStatus: 'pending' | 'approved' | 'delivered' | 'canceled') => {
    const updatedOrder = { ...order, status: newStatus };
    updateOrder(updatedOrder);
    setOrders(getOrders(currentStore.id));
    toast.success(`Status do pedido atualizado para ${getStatusLabel(newStatus)}`);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'delivered': return 'Entregue';
      case 'canceled': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'delivered': return 'bg-green-500';
      case 'canceled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const openNewOrderDialog = () => {
    setCurrentOrder(null);
    setOrderItems([]);
    setSupplier("");
    setNotes("");
    setIsDialogOpen(true);
  };

  const totalOrderValue = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Pedidos de Compra
        </h2>
        <Button onClick={openNewOrderDialog}>Novo Pedido</Button>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32 text-muted-foreground">
            Nenhum pedido registrado
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Pedido #{order.id.substring(0, 6)}</CardTitle>
                    <CardDescription>
                      {new Date(order.date).toLocaleDateString('pt-BR')} - {order.supplier}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Items:</strong> {order.items.length}
                  </div>
                  <div className="text-sm">
                    <strong>Total:</strong>{" "}
                    {order.totalValue.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </div>
                  
                  {order.notes && (
                    <div className="text-sm mt-2">
                      <strong>Observações:</strong>
                      <p className="text-muted-foreground">{order.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    {order.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => updateOrderStatus(order, 'approved')}
                        >
                          Aprovar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-500"
                          onClick={() => updateOrderStatus(order, 'canceled')}
                        >
                          Cancelar
                        </Button>
                      </>
                    )}
                    {order.status === 'approved' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateOrderStatus(order, 'delivered')}
                      >
                        Marcar como Entregue
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog para criar novo pedido */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Novo Pedido</DialogTitle>
            <DialogDescription>
              Adicione produtos ao pedido de compra para reposição de estoque.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="supplier">Fornecedor</Label>
              <Input
                id="supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Nome do fornecedor"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="product">Produto</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.code} - {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
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
              
              <Button 
                className="md:col-span-3" 
                onClick={handleAddItem}
                disabled={!selectedProductId || quantity <= 0}
              >
                Adicionar Item
              </Button>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Itens do Pedido</h4>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead className="text-right">Qtd.</TableHead>
                      <TableHead className="text-right">Preço Un.</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right w-[80px]">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          Nenhum item adicionado
                        </TableCell>
                      </TableRow>
                    ) : (
                      orderItems.map((item) => (
                        <TableRow key={item.productId}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            {item.unitPrice.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.totalPrice.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-500"
                              onClick={() => handleRemoveItem(item.productId)}
                            >
                              X
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    {orderItems.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Total:
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {totalOrderValue.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações adicionais (opcional)"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateOrder} disabled={orderItems.length === 0 || !supplier}>
              Criar Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersList;
