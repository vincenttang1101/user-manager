import { InputHTMLAttributes, ReactNode } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface InputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
  label: string;
  name: TName;
  control: Control<TFieldValues>;
  rightIcon?: ReactNode;
  classNameWrapper?: string;
}

export default function InputField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  name,
  control,
  rightIcon,
  classNameWrapper,
  ...props
}: InputFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={classNameWrapper}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input {...field} {...props} />
              {rightIcon && (
                <div className="absolute inset-y-0 right-0">{rightIcon}</div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
