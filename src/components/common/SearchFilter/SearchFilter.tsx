import { InputField } from "@/components/common/InputField";
import { SelectField } from "@/components/common/SelectField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/libs/utils";
import { SearchFilterFormData } from "@/schemas/searchFilter.schema";
import { UseFormReturn } from "react-hook-form";

const RoleOptions = [
  { value: "all", label: "All Roles" },
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "user", label: "User" },
];

type SearchFilterProps = {
  className?: string;
  form: UseFormReturn<SearchFilterFormData>;
  onSubmit: (data: SearchFilterFormData) => void;
};

export default function SearchFilter({
  className,
  form,
  onSubmit,
}: SearchFilterProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex-col w-fit sm:flex-row flex gap-6", className)}
        noValidate
      >
        <InputField
          control={form.control}
          name="search"
          classNameWrapper="max-w-[250px]"
        />
        <SelectField
          control={form.control}
          name="roleFilter"
          options={RoleOptions}
          placeholder="Select Role"
          classNameWrapper="w-[250px]"
        />
        <Button type="submit">Search</Button>
      </form>
    </Form>
  );
}
