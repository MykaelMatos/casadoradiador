
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SystemSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Sistema</CardTitle>
        <CardDescription>
          Personalize as configurações gerais do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="systemName">Nome do Sistema</Label>
          <Input id="systemName" defaultValue="Sistema de Controle de Estoque" />
        </div>
        
        <div>
          <Label htmlFor="systemLogo">Logo do Sistema</Label>
          <div className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-md">
            <div className="space-y-1 text-center">
              <div className="text-sm text-muted-foreground">
                Arraste e solte uma imagem aqui, ou clique para selecionar
              </div>
              <div className="flex justify-center">
                <Button variant="outline" size="sm">
                  Selecionar Arquivo
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <Label>Tema do Sistema</Label>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div className="flex flex-col items-center">
              <div className="w-full h-24 bg-blue-600 rounded-md mb-2"></div>
              <Label htmlFor="theme1" className="cursor-pointer flex items-center">
                <input
                  id="theme1"
                  type="radio"
                  name="theme"
                  defaultChecked
                  className="mr-2"
                />
                Padrão
              </Label>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-24 bg-green-600 rounded-md mb-2"></div>
              <Label htmlFor="theme2" className="cursor-pointer flex items-center">
                <input
                  id="theme2"
                  type="radio"
                  name="theme"
                  className="mr-2"
                />
                Verde
              </Label>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-24 bg-purple-600 rounded-md mb-2"></div>
              <Label htmlFor="theme3" className="cursor-pointer flex items-center">
                <input
                  id="theme3"
                  type="radio"
                  name="theme"
                  className="mr-2"
                />
                Roxo
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>Salvar Configurações</Button>
      </CardFooter>
    </Card>
  );
};

export default SystemSettings;
