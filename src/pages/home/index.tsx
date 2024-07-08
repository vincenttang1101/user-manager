import usersApi from "@/apis/users.api";
import { DataTable } from "@/components/common/DataTable";
import { Column } from "@/components/common/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { createWithRefresh } from "@/libs/utils";
import { UserFormModal } from "@/pages/home/components/UserFormModal";
import { UserFormData, userFormSchema } from "@/schemas/userForm.schema";
import { User } from "@/types/users.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      role: undefined,
      phone: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const getUsers = async () => {
    try {
      const usersRes = await usersApi.get();
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const withUserRefresh = createWithRefresh(getUsers);

  const handleAddUser = async (data: UserFormData) => {
    await usersApi.create(data);
    form.reset();
    toggleUserFormModal();
  };

  const handleUpdateUser = async (id: string, data: UserFormData) => {
    await usersApi.update(id, data);
    form.reset();
    toggleUserFormModal();
  };

  const handleDeleteUser = withUserRefresh(async (id: string) => {
    await usersApi.delete(id);
  });

  const handleSubmit = withUserRefresh(async (data: UserFormData) => {
    isUpdate
      ? await handleUpdateUser(selectedUser!.id, data)
      : await handleAddUser(data);
  });

  const toggleUserFormModal = (isUpdate: boolean = false, data?: User) => {
    setIsUpdate(isUpdate);
    setSelectedUser(data || null);
    setIsOpen(!isOpen);

    if (isUpdate && data) {
      form.reset({
        email: data.email,
        role: data.role as "editor" | "user" | "admin",
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        confirmPassword: data.password,
      });
    } else {
      form.reset({
        email: "",
        role: undefined,
        phone: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  const columns: Column<User>[] = [
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Firstname", accessor: "firstName" },
    { header: "Lastname", accessor: "lastName" },
    { header: "Role", accessor: "role" },
    {
      header: "Actions",
      accessor: (data) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            className="bg-transparent hover:bg-transparent"
            onClick={() => toggleUserFormModal(true, data)}
          >
            <img src="/icons/edit.svg" alt="Edit" className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            className="bg-transparent hover:bg-transparent"
            onClick={() => handleDeleteUser(data.id)}
          >
            <img src="/icons/trash.svg" alt="Delete" className="w-5 h-5" />
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    (async () => {
      await getUsers();
    })();
  }, []);

  return (
    <div className="px-5 py-10">
      <Button
        className="flex ml-auto"
        onClick={() => toggleUserFormModal(false)}
      >
        Add User
      </Button>
      <DataTable data={users} columns={columns} className="mt-5" />
      <UserFormModal
        isOpen={isOpen}
        isUpdate={isUpdate}
        form={form}
        onOpenChange={toggleUserFormModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
