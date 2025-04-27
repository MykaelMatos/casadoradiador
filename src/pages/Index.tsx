
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Login from "@/components/Login";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

const Index = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="max-w-md w-full px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary">Sistema de Estoque</h1>
          <p className="text-muted-foreground mt-2">
            Controle completo para o seu negócio
          </p>
        </div>

        {showAdminLogin ? (
          <div className="space-y-4 bg-white rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Login de Administrador</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAdminLogin(false)}
              >
                <span className="sr-only">Voltar</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m18 6-12 12"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </Button>
            </div>
            <Login />
            <p className="text-xs text-muted-foreground text-center mt-4">
              Acesso restrito às funções de administração do sistema.
            </p>
          </div>
        ) : (
          <>
            <Login />
            <div className="mt-6 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs flex items-center"
                onClick={() => setShowAdminLogin(true)}
              >
                <Settings className="mr-2 h-3 w-3" />
                Acesso Administrativo
              </Button>
            </div>
          </>
        )}

        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>Sistema de Controle de Estoque © {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
