import React, { forwardRef } from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "@radix-ui/react-icons";

type AvatarFieldProps = {
  control: Control<any>;
  name: string;
  selectedImage: string | null;
  onAvatarClick: () => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const AvatarField = forwardRef<HTMLInputElement, AvatarFieldProps>(
  ({ control, name, selectedImage, onAvatarClick, onImageChange }, ref) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex items-center flex-col">
            <FormLabel>Profile picture</FormLabel>
            <FormControl>
              <div className="flex flex-col justify-center items-center space-y-4">
                <Avatar
                  className="w-44 h-44 cursor-pointer"
                  onClick={onAvatarClick}
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
                  id={name}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      field.onChange(file);
                      onImageChange(e);
                    }
                  }}
                  className="hidden"
                  ref={(e) => {
                    if (typeof ref === "function") ref(e);
                    else if (ref) ref.current = e;
                    field.ref(e);
                  }}
                />
                <Button type="button" onClick={onAvatarClick}>
                  Select Image
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);

AvatarField.displayName = "AvatarField";

export default AvatarField;
