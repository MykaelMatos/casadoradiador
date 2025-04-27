
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/contexts/StoreContext";
import Navbar from "@/components/Navbar";
import StoreSelector from "@/components/StoreSelector";
import InventoryTable from "@/components/InventoryTable";
import StockEntry from "@/components/StockEntry";
import StockExit from "@/components/StockExit";
import AlertsPanel from "@/components/AlertsPanel";
import OrdersList from "@/components/OrdersList";
import ReportGenerator from "@/components/ReportGenerator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Box, ArrowUp, ArrowDown, Calendar, Bell, Archive } from "lucide-react";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { currentStore } = useStore();
  const [activeTab, setActiveTab] = useState("inventory");

  // Se o usuário não estiver autenticado, redirecionar para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Se não houver uma loja selecionada, mostrar o seletor de lojas
  if (!currentStore) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <StoreSelector />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto py-6 px-4 flex-1">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <span>Dashboard</span>
          <span className="text-lg text-muted-foreground">
            | {currentStore.name}
          </span>
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Box className="h-4 w-4" />
              <span>Estoque</span>
            </TabsTrigger>
            <TabsTrigger value="entry" className="flex items-center gap-2">
              <ArrowUp className="h-4 w-4" />
              <span>Entrada</span>
            </TabsTrigger>
            <TabsTrigger value="exit" className="flex items-center gap-2">
              <ArrowDown className="h-4 w-4" />
              <span>Saída</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Pedidos</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Alertas</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              <span>Relatórios</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <InventoryTable />
          </TabsContent>

          <TabsContent value="entry">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <StockEntry />
              </div>
              <div>
                <AlertsPanel />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="exit">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <StockExit />
              </div>
              <div>
                <AlertsPanel />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <OrdersList />
          </TabsContent>

          <TabsContent value="alerts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AlertsPanel />
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Ações Recomendadas</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium">Produtos com estoque baixo</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    É recomendado criar pedidos de compra para os produtos com níveis baixos de estoque.
                  </p>
                  <button className="text-primary text-sm mt-2 underline">
                    Criar pedido de compra automático
                  </button>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium">Configurar alertas por email</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Configure alertas para serem enviados por e-mail quando o nível de estoque atingir valores críticos.
                  </p>
                  <button className="text-primary text-sm mt-2 underline">
                    Configurar notificações
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ReportGenerator />
              <div className="md:col-span-2">
                <div className="bg-muted p-6 rounded-lg h-full">
                  <h3 className="font-bold text-xl mb-4">Visualização de Relatório</h3>
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-md p-8 flex items-center justify-center h-[400px]">
                    <div className="text-center text-muted-foreground">
                      <p className="mb-2">Selecione um relatório para visualizar</p>
                      <p className="text-sm">Os relatórios são gerados em formato ODF</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
