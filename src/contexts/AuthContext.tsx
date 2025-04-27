
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  role: "admin" | "manager" | "employee";
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users para demo
const MOCK_USERS = [
  {
    id: "1",
    email: "mykael@admin.com",
    password: "Mkm201015",
    name: "Mykael",
    role: "admin" as const,
  },
  {
    id: "2",
    email: "gerente@loja.com",
    password: "123456",
    name: "Gerente",
    role: "manager" as const,
  },
  {
    id: "3",
    email: "funcionario@loja.com",
    password: "123456",
    name: "Funcionário",
    role: "employee" as const,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar se há um usuário salvo na sessão
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Erro ao restaurar sessão de usuário:", error);
        sessionStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulação de login
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      sessionStorage.setItem("user", JSON.stringify(userWithoutPassword));
      toast.success("Login realizado com sucesso!");
      return true;
    }

    toast.error("Email ou senha incorretos!");
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("currentStore");
    navigate("/");
    toast.info("Saiu do sistema com sucesso!");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
