import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";

import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { UserFormData } from "@/schemas/userForm.schema";
import { InputField } from "@/components/common/InputField";
import { SelectField } from "@/components/common/SelectField";
import { AvatarField } from "@/components/common/AvatarField";

type UserFormModal = {
  isOpen: boolean;
  isUpdate: boolean;
  form: UseFormReturn<UserFormData>;
  onOpenChange: () => void;
  onSubmit: (data: UserFormData) => void;
};

const RoleOptions = [
  { value: "admin", label: "Admin", disabled: true },
  { value: "editor", label: "Editor" },
  { value: "user", label: "User" },
];

export default function UserFormModal({
  isOpen,
  isUpdate,
  form,
  onOpenChange,
  onSubmit,
}: UserFormModal) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const togglePasswordVisibility = () => {
    setIsShowPassword(!isShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsShowConfirmPassword(!isShowConfirmPassword);
  };

  useEffect(() => {
    if (!isOpen) {
      setIsShowPassword(false);
      setIsShowConfirmPassword(false);
      setSelectedImage(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isUpdate) setSelectedImage(form.getValues("avatar") as string);
  }, [isUpdate]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:max-w-[500px] lg:max-w-[850px] overflow-y-scroll lg:overflow-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>{isUpdate ? "Update user" : "Add new user"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
            noValidate
          >
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-3">
              <div className="lg:col-span-8 lg:grid grid-cols-12 gap-4 lg:border-r lg:border-r-gray-300 lg:pr-8">
                <InputField
                  control={form.control}
                  label="Email *"
                  name="email"
                  type="email"
                  classNameWrapper="lg:col-span-6"
                />
                <SelectField
                  control={form.control}
                  name="role"
                  label="Role *"
                  options={RoleOptions}
                  placeholder="Select Role"
                  classNameWrapper="col-span-6"
                  disabled={form.getValues("role") === "admin"}
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
                      type="button"
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
                      type="button"
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
              <div className="lg:col-span-4 flex items-center flex-col gap-3">
                <AvatarField
                  ref={fileInputRef}
                  control={form.control}
                  name="avatar"
                  selectedImage={selectedImage}
                  onAvatarClick={handleAvatarClick}
                  onImageChange={handleImageChange}
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <Button variant="outline" onClick={onOpenChange}>
                Cancel
              </Button>
              <Button type="submit">
                {isUpdate ? "Update User" : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
