import { z } from "zod";

export const searchFilterSchema = z.object({
  search: z.string().optional(),
  roleFilter: z.enum(["all", "admin", "editor", "user"]),
});

export type SearchFilterFormData = z.infer<typeof searchFilterSchema>;
