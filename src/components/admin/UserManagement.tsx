
import { useState, useEffect } from "react";
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
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "employee";
  password: string;
}

interface UserFormState {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "employee";
  password: string;
}

const UserManagement = () => {
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
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

  const [userForm, setUserForm] = useState<UserFormState>({
    id: "",
    name: "",
    email: "",
    role: "employee",
    password: ""
  });

  useEffect(() => {
    localStorage.setItem("system_users", JSON.stringify(users));
  }, [users]);

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
    const role = value as "admin" | "manager" | "employee";
    setUserForm({
      ...userForm,
      role
    });
  };

  const handleSaveUser = () => {
    if (!userForm.name || !userForm.email || !userForm.password) {
      toast.error("Todos os campos obrigatórios devem ser preenchidos");
      return;
    }

    if (userForm.id) {
      setUsers(users.map(u => (u.id === userForm.id ? userForm : u)));
      toast.success(`Usuário ${userForm.name} atualizado com sucesso!`);
    } else {
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

  return (
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
    </Card>
  );
};

export default UserManagement;
