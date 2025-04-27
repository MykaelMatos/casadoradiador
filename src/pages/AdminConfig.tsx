
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore, Store } from "@/contexts/StoreContext";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

// Interface para usuário
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "employee";
  password: string;
}

// Interface para o formulário de usuário
interface UserFormState {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "employee";
  password: string;
}

const AdminConfig = () => {
  const { user, isAdmin } = useAuth();
  const { stores, updateStore, deleteStore } = useStore();
  
  // Se o usuário não for admin, redirecionar
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Estado para diálogos
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isStoreDialogOpen, setIsStoreDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Estado para usuários e loja atual
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem("system_users");
    return storedUsers ? JSON.parse(storedUsers) : [
      {
        id: "1",
        name: "Mykael",
        email: "mykael@admin.com",
        role: "admin" as const,
        password: "Mkm201015"
      }
    ];
  });
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  
  // Estado para formulários
  const [userForm, setUserForm] = useState<UserFormState>({
    id: "",
    name: "",
    email: "",
    role: "employee",
    password: ""
  });
  const [storeForm, setStoreForm] = useState({
    id: "",
    name: "",
    address: "",
    phone: ""
  });

  // Salvar usuários sempre que forem alterados
  useEffect(() => {
    localStorage.setItem("system_users", JSON.stringify(users));
  }, [users]);

  // Funções para manipular usuários
  const openNewUserDialog = () => {
    setUserForm({
      id: "",
      name: "",
      email: "",
      role: "employee",
      password: ""
    });
    setIsUserDialogOpen(true);
  };

  const openEditUserDialog = (user: User) => {
    setUserForm({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      password: user.password
    });
    setIsUserDialogOpen(true);
  };

  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm({
      ...userForm,
      [name]: value
    });
  };

  const handleUserRoleChange = (value: string) => {
    // Ensure role is one of the allowed values
    const role = value as "admin" | "manager" | "employee";
    setUserForm({
      ...userForm,
      role
    });
  };

  const handleSaveUser = () => {
    // Validação
    if (!userForm.name || !userForm.email || !userForm.password) {
      toast.error("Todos os campos obrigatórios devem ser preenchidos");
      return;
    }

    if (userForm.id) {
      // Edição
      setUsers(users.map(u => (u.id === userForm.id ? userForm : u)));
      toast.success(`Usuário ${userForm.name} atualizado com sucesso!`);
    } else {
      // Criação
      const newUser: User = {
        ...userForm,
        id: Math.random().toString(36).substr(2, 9)
      };
      setUsers([...users, newUser]);
      toast.success(`Usuário ${userForm.name} criado com sucesso!`);
    }

    setIsUserDialogOpen(false);
  };

  const deleteUser = (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete && userToDelete.role === "admin" && users.filter(u => u.role === "admin").length <= 1) {
      toast.error("Não é possível excluir o único usuário administrador");
      return;
    }

    setUsers(users.filter(u => u.id !== userId));
    toast.success("Usuário excluído com sucesso!");
  };

  // Funções para manipular lojas
  const openEditStoreDialog = (store: Store) => {
    setStoreForm({
      id: store.id,
      name: store.name,
      address: store.address || "",
      phone: store.phone || ""
    });
    setCurrentStore(store);
    setIsStoreDialogOpen(true);
  };

  const openDeleteStoreDialog = (store: Store) => {
    setCurrentStore(store);
    setIsDeleteDialogOpen(true);
  };

  const handleStoreFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStoreForm({
      ...storeForm,
      [name]: value
    });
  };

  const handleSaveStore = () => {
    if (!storeForm.name) {
      toast.error("Nome da loja é obrigatório");
      return;
    }

    updateStore({
      id: storeForm.id,
      name: storeForm.name,
      address: storeForm.address,
      phone: storeForm.phone
    });

    toast.success(`Loja ${storeForm.name} atualizada com sucesso!`);
    setIsStoreDialogOpen(false);
  };

  const handleDeleteStore = () => {
    if (currentStore) {
      deleteStore(currentStore.id);
      toast.success(`Loja ${currentStore.name} excluída com sucesso!`);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Configurações de Administrador</h1>
        
        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="stores">Lojas</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gerenciamento de Usuários</CardTitle>
                    <CardDescription>
                      Crie e gerencie usuários que terão acesso ao sistema
                    </CardDescription>
                  </div>
                  <Button onClick={openNewUserDialog}>Novo Usuário</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.role === "admin"
                            ? "Administrador"
                            : user.role === "manager"
                            ? "Gerente"
                            : "Funcionário"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditUserDialog(user)}
                            >
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-500"
                              onClick={() => deleteUser(user.id)}
                            >
                              Excluir
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stores">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Lojas</CardTitle>
                <CardDescription>
                  Edite ou exclua lojas registradas no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stores.map((store) => (
                    <Card key={store.id} className="overflow-hidden">
                      <CardHeader className="bg-muted/50">
                        <CardTitle className="text-lg">{store.name}</CardTitle>
                        {store.address && (
                          <CardDescription>{store.address}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="p-4">
                        {store.phone && (
                          <p className="text-sm text-muted-foreground">
                            Telefone: {store.phone}
                          </p>
                        )}
                      </CardContent>
                      <CardFooter className="bg-muted/30 flex justify-between">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditStoreDialog(store)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500"
                          onClick={() => openDeleteStoreDialog(store)}
                        >
                          Excluir
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog para criar/editar usuário */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {userForm.id ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>
            <DialogDescription>
              Preencha os campos para {userForm.id ? "atualizar o" : "criar um novo"} usuário.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={userForm.name}
                onChange={handleUserFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={userForm.email}
                onChange={handleUserFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Função</Label>
              <Select 
                value={userForm.role} 
                onValueChange={handleUserRoleChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="employee">Funcionário</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={userForm.password}
                onChange={handleUserFormChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUser}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar loja */}
      <Dialog open={isStoreDialogOpen} onOpenChange={setIsStoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Loja</DialogTitle>
            <DialogDescription>
              Atualize as informações da loja.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Loja</Label>
              <Input
                id="name"
                name="name"
                value={storeForm.name}
                onChange={handleStoreFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                name="address"
                value={storeForm.address}
                onChange={handleStoreFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={storeForm.phone}
                onChange={handleStoreFormChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStoreDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveStore}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar exclusão de loja */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Loja</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. Todos os dados associados a esta loja serão removidos.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              Tem certeza que deseja excluir a loja <strong>{currentStore?.name}</strong>?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteStore}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminConfig;
