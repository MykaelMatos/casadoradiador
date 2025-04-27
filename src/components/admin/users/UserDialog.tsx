
import { Button } from "@/components/ui/button";
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

interface UserFormState {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "employee";
  password: string;
}

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  userForm: UserFormState;
  handleUserFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUserRoleChange: (value: string) => void;
}

const UserDialog = ({
  isOpen,
  onClose,
  onSave,
  userForm,
  handleUserFormChange,
  handleUserRoleChange,
}: UserDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            <Select value={userForm.role} onValueChange={handleUserRoleChange}>
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
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
