import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ReactNode, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EyeClosedIcon, EyeOpenIcon, ImageIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserFormData, userFormSchema } from "@/schemas/userForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/common/InputField";

type UserFormModal = {
  isUpdate: boolean;
  children: ReactNode;
};

export default function UserFormModal({ isUpdate, children }: UserFormModal) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UserFormData>({
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const togglePasswordVisibility = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsShowPassword(!isShowPassword);
  };

  const toggleConfirmPasswordVisibility = (event: React.MouseEvent) => {
    event.preventDefault();

    setIsShowConfirmPassword(!isShowConfirmPassword);
  };

  const onSubmit = (data: UserFormData) => {
    console.log(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[850px]">
        <DialogHeader>
          <DialogTitle>{isUpdate ? "Update user" : "Add new user"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
            noValidate
          >
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-8 grid grid-cols-12 gap-4 border-r border-r-gray-300 pr-8">
                <InputField
                  control={form.control}
                  label="Email *"
                  name="email"
                  type="email"
                  classNameWrapper="col-span-6"
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>Role *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <InputField
                  control={form.control}
                  label="Phone *"
                  name="phone"
                  type="tel"
                  classNameWrapper="col-span-12"
                />
                <InputField
                  control={form.control}
                  label="First Name *"
                  name="firstName"
                  classNameWrapper="col-span-6"
                />
                <InputField
                  control={form.control}
                  label="Last Name *"
                  name="lastName"
                  classNameWrapper="col-span-6"
                />
                <InputField
                  control={form.control}
                  label="Password *"
                  name="password"
                  type={isShowPassword ? "text" : "password"}
                  rightIcon={
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={togglePasswordVisibility}
                    >
                      {isShowPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                    </Button>
                  }
                  classNameWrapper="col-span-12"
                />
                <InputField
                  control={form.control}
                  label="Confirm Password *"
                  name="confirmPassword"
                  type={isShowConfirmPassword ? "text" : "password"}
                  rightIcon={
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {isShowConfirmPassword ? (
                        <EyeClosedIcon />
                      ) : (
                        <EyeOpenIcon />
                      )}
                    </Button>
                  }
                  classNameWrapper="col-span-12"
                />
              </div>
              <div className="col-span-4 flex items-center flex-col gap-3">
                <FormLabel>Profile picture</FormLabel>
                <Avatar
                  className="w-44 h-44 mb-4 cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  {selectedImage ? (
                    <AvatarImage src={selectedImage} alt="Selected profile" />
                  ) : (
                    <AvatarFallback>
                      <ImageIcon className="w-20 h-20 text-gray-400" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button onClick={handleAvatarClick}>Select Image</Button>
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <Button variant="outline">Cancel</Button>
              <Button type="submit">{isUpdate ? "Update" : "Add User"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
