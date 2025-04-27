
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "employee";
  password: string;
}

interface UsersListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const UsersList = ({ users, onEdit, onDelete }: UsersListProps) => {
  const getRoleLabel = (role: "admin" | "manager" | "employee") => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "manager":
        return "Gerente";
      case "employee":
        return "Funcionário";
    }
  };

  return (
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
            <TableCell>{getRoleLabel(user.role)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(user)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500"
                  onClick={() => onDelete(user.id)}
                >
                  Excluir
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersList;
