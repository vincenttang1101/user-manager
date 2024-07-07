import usersApi from "@/apis/users.api";
import { DataTable } from "@/components/common/DataTable";
import { Column } from "@/components/common/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { UserFormModal } from "@/pages/home/components/UserFormModal";
import { User } from "@/types/users.api";
import { useEffect, useState } from "react";

const getUsers = async () => {
  const usersRes = await usersApi.get();
  return usersRes.data;
};

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);

  const columns: Column<User>[] = [
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Firstname", accessor: "firstName" },
    { header: "Lastname", accessor: "lastName" },
    { header: "Role", accessor: "role" },
    {
      header: "Actions",
      accessor: () => (
        <div className="flex gap-2">
          <UserFormModal isUpdate>
            <Button size="icon" className="bg-transparent hover:bg-transparent">
              <img src="/icons/edit.svg" alt="Edit" className="w-5 h-5" />
            </Button>
          </UserFormModal>
          <Button size="icon" className="bg-transparent hover:bg-transparent">
            <img src="/icons/trash.svg" alt="Delete" className="w-5 h-5" />
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    (async () => {
      const usersData = await getUsers();
      setUsers(usersData);
    })();
  }, []);

  return (
    <div className="px-5 py-10">
      <UserFormModal isUpdate={false}>
        <Button className="flex ml-auto">Add User</Button>
      </UserFormModal>
      <DataTable data={users} columns={columns} className="mt-5" />
    </div>
  );
}
