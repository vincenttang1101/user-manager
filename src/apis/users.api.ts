import httpService from "@/services/http.service";
import { User } from "@/types/users.api";

const usersApi = {
  get: () => httpService.get<User[]>("/users"),
  getById: (id: string) => httpService.get<User>(`users/${id}`),
  create: (data: Omit<User, "id" | "confirm_password" | "createdAt">) =>
    httpService.post<User>("/users", data),
  update: (
    id: string,
    body: Omit<User, "id" | "confirm_password" | "createdAt">
  ) => httpService.patch<User>(`/users/${id}`, body),
  delete: (id: string) => httpService.delete<User>(`/users/${id}`),
};

export default usersApi;
