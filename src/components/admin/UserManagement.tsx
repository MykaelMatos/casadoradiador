
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import UsersList from "./users/UsersList";
import UserDialog from "./users/UserDialog";

interface User {
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

  const [userForm, setUserForm] = useState<User>({
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
    setUserForm(user);
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
      const newUser = {
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
        <UsersList 
          users={users}
          onEdit={openEditUserDialog}
          onDelete={deleteUser}
        />
      </CardContent>

      <UserDialog
        isOpen={isUserDialogOpen}
        onClose={() => setIsUserDialogOpen(false)}
        onSave={handleSaveUser}
        userForm={userForm}
        handleUserFormChange={handleUserFormChange}
        handleUserRoleChange={handleUserRoleChange}
      />
    </Card>
  );
};

export default UserManagement;
