
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product, getAlerts } from "@/utils/stockUtils";
import { useStore } from "@/contexts/StoreContext";
import { Bell } from "lucide-react";

const AlertsPanel = () => {
  const { currentStore } = useStore();
  const [alerts, setAlerts] = useState<Product[]>([]);

  useEffect(() => {
    if (currentStore) {
      setAlerts(getAlerts(currentStore.id));
    }
  }, [currentStore]);

  // Atualiza os alertas a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentStore) {
        setAlerts(getAlerts(currentStore.id));
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [currentStore]);

  if (!alerts.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alertas de Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Não há alertas de estoque no momento
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-red-500" />
          Alertas de Estoque
          <Badge variant="destructive" className="ml-2">
            {alerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map(product => (
            <div key={product.id} className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">Código: {product.code}</p>
                </div>
                {product.quantity === 0 ? (
                  <Badge variant="destructive">Estoque Zerado</Badge>
                ) : (
                  <Badge variant="outline" className="bg-inventory-low text-white">
                    Estoque Baixo: {product.quantity}/{product.minQuantity}
                  </Badge>
                )}
              </div>
              <div className="mt-2 flex justify-end">
                <Button size="sm" variant="outline">
                  Solicitar Reposição
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
