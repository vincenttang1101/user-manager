export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  password: string;
  role: "admin" | "editor" | "user";
  createdAt: string;
};
