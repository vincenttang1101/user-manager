import usersApi from "@/apis/users.api";
import { CustomPagination } from "@/components/common/CustomPagination";
import { DataTable } from "@/components/common/DataTable";
import { Column } from "@/components/common/DataTable/DataTable";
import { SearchFilter } from "@/components/common/SearchFilter";
import { Button } from "@/components/ui/button";
import { PaginationConfig } from "@/constants/pagination";
import {
  createWithRefresh,
  exportToExcel,
  hashPassword,
  omit,
} from "@/libs/utils";
import { UserFormModal } from "@/pages/home/components/UserFormModal";
import {
  SearchFilterFormData,
  searchFilterSchema,
} from "@/schemas/searchFilter.schema";
import { UserFormData, userFormSchema } from "@/schemas/userForm.schema";
import cloudinaryService from "@/services/cloudinary.service";
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

  const [isLoading, setIsLoading] = useState(false);
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
      search: params.search,
      roleFilter: params.roleFilter as "all" | "admin" | "editor" | "user",
    },
  });

  const getUsers = async () => {
    setIsLoading(true);
    try {
      const usersRes = await usersApi.get();
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const withUserRefresh = createWithRefresh(getUsers);

  const paginateData = (data: User[], pageIndex: number, pageSize: number) => {
    const startIndex = (pageIndex - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  };

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
    try {
      if (!(data.avatar instanceof File)) {
        throw new Error("Avatar is required and must be a file");
      }

      const uploadResult = await cloudinaryService.uploadImage(data.avatar);

      if (!uploadResult || !uploadResult.secure_url) {
        throw new Error("Failed to upload avatar");
      }

      const hashedPassword = await hashPassword(data.password);

      const newUserData = omit(
        {
          ...data,
          password: hashedPassword,
          avatar: uploadResult.secure_url,
        },
        ["confirmPassword"]
      );

      await usersApi.create(newUserData);

      userForm.reset();
      toggleUserFormModal();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleUpdateUser = async (id: string, data: UserFormData) => {
    let newAvatarUrl = data.avatar;
    let hashedPassword = data.password;

    if (newAvatarUrl instanceof File) {
      const uploadResult = await cloudinaryService.uploadImage(newAvatarUrl);
      newAvatarUrl = uploadResult.secure_url;

      const oldUser = (await usersApi.getById(id)).data;
      const oldPublicId = cloudinaryService.extractPublicIdFromUrl(
        oldUser.avatar
      );
      await cloudinaryService.deleteImage(oldPublicId);
    }

    if (data.password !== selectedUser?.password) {
      hashedPassword = await hashPassword(data.password);
    }

    const updatedData = omit(
      {
        ...data,
        password: hashedPassword,
        avatar: newAvatarUrl,
      },
      ["confirmPassword"]
    );

    await usersApi.update(id, updatedData);
    userForm.reset();
    toggleUserFormModal();
  };

  const handleDeleteUser = withUserRefresh(async (data: User) => {
    setIsLoading(true);
    try {
      const publicId = cloudinaryService.extractPublicIdFromUrl(
        data.avatar as string
      );
      await cloudinaryService.deleteImage(publicId);
      await usersApi.delete(data.id);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsLoading(false);
    }
  });

  const applyFiltersAndSearch = (
    data: User[],
    filters: SearchFilterFormData
  ) => {
    return data.filter((user) => {
      const searchMatch = filters.search
        ? user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.phone.includes(filters.search)
        : true;

      const roleMatch =
        filters.roleFilter && filters.roleFilter !== "all"
          ? user.role === filters.roleFilter
          : true;

      return searchMatch && roleMatch;
    });
  };

  const handleUserFormSubmit = withUserRefresh(async (data: UserFormData) => {
    setIsLoading(true);
    try {
      isUpdate
        ? await handleUpdateUser(selectedUser!.id, data)
        : await handleAddUser(data);
    } finally {
      setIsLoading(false);
    }
  });

  const handleSearchFilterSubmit = (data: SearchFilterFormData) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("search", data.search || "");
    newParams.set("roleFilter", data.roleFilter);
    newParams.set("pageIndex", "1");
    newParams.set("pageSize", params.pageSize.toString());
    setSearchParams(newParams);

    setFilteredUsers(applyFiltersAndSearch(users, data));
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
        avatar: data.avatar,
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
        avatar: undefined,
        password: "",
        confirmPassword: "",
      });
    }
  };

  const columns: Column<User>[] = [
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    {
      header: "Avatar",
      accessor: (row) => (
        <img
          src={row.avatar}
          alt="Avatar"
          className="w-12 aspect-square object-cover rounded-full"
        />
      ),
    },
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
          {data.role !== "admin" && (
            <Button
              size="icon"
              className="bg-transparent hover:bg-transparent"
              onClick={() => handleDeleteUser(data)}
            >
              <img src="/icons/trash.svg" alt="Delete" className="w-5 h-5" />
            </Button>
          )}
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
    const currentFilters = searchFilterForm.getValues();
    setFilteredUsers(applyFiltersAndSearch(users, currentFilters));
  }, [users]);

  useEffect(() => {
    setPaginatedUsers(
      paginateData(filteredUsers, params.pageIndex, params.pageSize)
    );
  }, [filteredUsers, params.pageIndex, params.pageSize]);

  return (
    <div>
      <div className="flex w-fit flex-col sm:flex-row  gap-5">
        <Button onClick={handleExportToExcel} disabled={isLoading}>
          Export to Excel
        </Button>
        <Button
          className="flex"
          onClick={() => toggleUserFormModal(false)}
          disabled={isLoading}
        >
          Add User
        </Button>
      </div>
      <SearchFilter
        className="mt-5"
        form={searchFilterForm}
        onSubmit={handleSearchFilterSubmit}
      />
      <DataTable
        data={paginatedUsers}
        columns={columns}
        isLoading={isLoading}
        classNameWrapper="mt-10"
      />
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
