
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  generateReport,
  getProducts,
  getStockMovements
} from "@/utils/stockUtils";
import { useStore } from "@/contexts/StoreContext";
import { Archive } from "lucide-react";

const ReportGenerator = () => {
  const { currentStore } = useStore();
  const [reportType, setReportType] = useState("stock");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleGenerateReport = () => {
    if (!currentStore) return;

    switch (reportType) {
      case "stock":
        const currentStock = getProducts(currentStore.id);
        generateReport(currentStock, "estoque_atual");
        break;
      case "entries":
        const entries = getStockMovements(currentStore.id, {
          type: "entry",
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        });
        generateReport(entries, "entradas");
        break;
      case "exits":
        const exits = getStockMovements(currentStore.id, {
          type: "exit",
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        });
        generateReport(exits, "saidas");
        break;
      case "all_movements":
        const allMovements = getStockMovements(currentStore.id, {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        });
        generateReport(allMovements, "movimentacoes");
        break;
      default:
        break;
    }
  };

  const showDateFilter = reportType !== "stock";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Archive className="h-5 w-5" />
          Geração de Relatórios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reportType">Tipo de Relatório</Label>
            <Select
              value={reportType}
              onValueChange={(value) => setReportType(value)}
            >
              <SelectTrigger id="reportType">
                <SelectValue placeholder="Selecione o tipo de relatório" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stock">Estoque Atual</SelectItem>
                <SelectItem value="entries">Entradas de Estoque</SelectItem>
                <SelectItem value="exits">Saídas de Estoque</SelectItem>
                <SelectItem value="all_movements">Todas as Movimentações</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showDateFilter && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data Inicial</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Data Final</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}

          <Button 
            className="w-full" 
            onClick={handleGenerateReport}
            disabled={!currentStore}
          >
            Gerar Relatório
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Relatórios são gerados em formato JSON para demonstração.
            Em uma implementação real, seria exportado em ODF/PDF.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
