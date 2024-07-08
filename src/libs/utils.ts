import { User } from "@/types/users.api";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type RefreshFunction<T> = () => Promise<T>;

export function createWithRefresh<T>(refreshFn: RefreshFunction<T>) {
  return function withRefresh<Args extends any[]>(
    operation: (...args: Args) => Promise<void>
  ) {
    return async (...args: Args): Promise<void> => {
      try {
        await operation(...args);
      } finally {
        await refreshFn();
      }
    };
  };
}

export function createQueryString(
  params: Record<string, string | number | null | undefined>
) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });
  return `?${searchParams.toString()}`;
}

export function exportToExcel(users: User[]) {
  const data = users.map((user) => ({
    Email: user.email,
    Phone: user.phone,
    Firstname: user.firstName,
    Lastname: user.lastName,
    Role: user.role,
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  XLSX.utils.book_append_sheet(wb, ws, "Users");

  XLSX.writeFile(wb, "users.xlsx");
}
