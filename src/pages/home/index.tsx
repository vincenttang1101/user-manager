import usersApi from "@/apis/users.api";
import { CustomPagination } from "@/components/common/CustomPagination";
import { DataTable } from "@/components/common/DataTable";
import { Column } from "@/components/common/DataTable/DataTable";
import { SearchFilter } from "@/components/common/SearchFilter";
import { Button } from "@/components/ui/button";
import { PaginationConfig } from "@/constants/pagination";
import { createWithRefresh, exportToExcel } from "@/libs/utils";
import { UserFormModal } from "@/pages/home/components/UserFormModal";
import {
  SearchFilterFormData,
  searchFilterSchema,
} from "@/schemas/searchFilter.schema";
import { UserFormData, userFormSchema } from "@/schemas/userForm.schema";
import { User } from "@/types/users.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = Object.fromEntries([...searchParams]);
  const { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } = PaginationConfig;

  const params = {
    pageIndex: Number(queryParams.pageIndex) || DEFAULT_PAGE_INDEX,
    pageSize: Number(queryParams.pageSize) || DEFAULT_PAGE_SIZE,
    search: queryParams.search || "",
    roleFilter: queryParams.roleFilter || "all",
  };

  const [users, setUsers] = useState<User[]>([]);
  const [paginatedUsers, setPaginatedUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const userForm = useForm<UserFormData>({
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

  const searchFilterForm = useForm<SearchFilterFormData>({
    resolver: zodResolver(searchFilterSchema),
    defaultValues: {
      search: "",
      roleFilter: params.roleFilter as "all" | "admin" | "editor" | "user",
    },
  });

  const paginateData = (data: User[], pageIndex: number, pageSize: number) => {
    const startIndex = (pageIndex - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  };

  const getUsers = async () => {
    try {
      const usersRes = await usersApi.get();
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const withUserRefresh = createWithRefresh(getUsers);

  const handlePageSizeChange = (newPageSize: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("pageSize", newPageSize.toString());
    newParams.set("pageIndex", params.pageIndex.toString());
    setSearchParams(newParams);
  };

  const handleExportToExcel = () => {
    exportToExcel(users);
  };

  const handleAddUser = async (data: UserFormData) => {
    await usersApi.create(data);
    userForm.reset();
    toggleUserFormModal();
  };

  const handleUpdateUser = async (id: string, data: UserFormData) => {
    await usersApi.update(id, data);
    userForm.reset();
    toggleUserFormModal();
  };

  const handleDeleteUser = withUserRefresh(async (id: string) => {
    await usersApi.delete(id);
  });

  const handleUserFormSubmit = withUserRefresh(async (data: UserFormData) => {
    isUpdate
      ? await handleUpdateUser(selectedUser!.id, data)
      : await handleAddUser(data);
  });

  const handleSearchFilterSubmit = (data: SearchFilterFormData) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("search", data.search || "");
    newParams.set("roleFilter", data.roleFilter);
    newParams.set("pageIndex", "1");
    newParams.set("pageSize", params.pageSize.toString());
    setSearchParams(newParams);

    const filtered = users.filter((user) => {
      const searchMatch = data.search
        ? user.email.toLowerCase().includes(data.search.toLowerCase()) ||
          user.firstName.toLowerCase().includes(data.search.toLowerCase()) ||
          user.lastName.toLowerCase().includes(data.search.toLowerCase()) ||
          user.email.toLowerCase().includes(data.search.toLowerCase()) ||
          user.phone.includes(data.search)
        : true;

      const roleMatch =
        data.roleFilter && data.roleFilter !== "all"
          ? user.role === data.roleFilter
          : true;

      return searchMatch && roleMatch;
    });

    setFilteredUsers(filtered);
  };

  const toggleUserFormModal = (isUpdate: boolean = false, data?: User) => {
    setIsUpdate(isUpdate);
    setSelectedUser(data || null);
    setIsOpen(!isOpen);

    if (isUpdate && data) {
      userForm.reset({
        email: data.email,
        role: data.role as "editor" | "user" | "admin",
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        confirmPassword: data.password,
      });
    } else {
      userForm.reset({
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
    { header: "Firstname", accessor: "firstName", sortable: true },
    { header: "Lastname", accessor: "lastName", sortable: true },
    { header: "Role", accessor: "role", sortable: true },
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

  useEffect(() => {
    handleSearchFilterSubmit(searchFilterForm.getValues());
  }, [users]);

  useEffect(() => {
    setPaginatedUsers(
      paginateData(filteredUsers, params.pageIndex, params.pageSize)
    );
  }, [filteredUsers, params.pageIndex, params.pageSize]);

  return (
    <div className="px-5 py-10">
      <div className="flex w-fit flex-col sm:flex-row  gap-5">
        <Button onClick={handleExportToExcel}>Export to Excel</Button>
        <Button className="flex" onClick={() => toggleUserFormModal(false)}>
          Add User
        </Button>
      </div>
      <SearchFilter
        className="mt-5"
        form={searchFilterForm}
        onSubmit={handleSearchFilterSubmit}
      />
      <DataTable data={paginatedUsers} columns={columns} className="mt-5" />
      <CustomPagination
        currentPage={params.pageIndex}
        pageSize={params.pageSize}
        totalItems={filteredUsers.length}
        onPageSizeChange={handlePageSizeChange}
        className="mt-5"
      />
      <UserFormModal
        isOpen={isOpen}
        isUpdate={isUpdate}
        form={userForm}
        onOpenChange={toggleUserFormModal}
        onSubmit={handleUserFormSubmit}
      />
    </div>
  );
}
