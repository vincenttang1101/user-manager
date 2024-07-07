import httpService from "@/services/http.service";
import { User } from "@/types/users.api";

const usersApi = {
  get: () => httpService.get<User[]>("/users"),
};

export default usersApi;
