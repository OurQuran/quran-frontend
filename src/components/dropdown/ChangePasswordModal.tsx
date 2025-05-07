import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { onError, onSuccess } from "@/helpers/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppDialog from "../AppDialog";
import { EyeIcon, EyeOff } from "lucide-react";
import { Input } from "../ui/input";
import useAdd from "@/react-query/useAdd";

export default function ChangePasswordModal({
  id,
  isSelf = false,
  children,
  isOpen,
  setIsOpen,
}: {
  id?: string;
  isSelf?: boolean;
  children?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [t] = useTranslation("global");

  const [showPassword, setShowPassword] = useState(false);

  const formSchema = z
    .object({
      old_password: !isSelf ? z.string().optional() : z.string(),
      new_password: z
        .string()
        .refine(
          (val) =>
            !val ||
            (val.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val)),
          {
            message: t(
              "Password must be at least 8 characters and include uppercase, lowercase, and a number"
            ),
          }
        ),
      new_password_confirmation: z.string(),
    })
    .refine((data) => data.new_password === data.new_password_confirmation, {
      message: t("Passwords must match"),
      path: ["new_password_confirmation"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onMutationSuccess() {
    setIsOpen(false);
    onSuccess(t("Password Changed successfully"));
  }
  function onMutationError() {
    onError(t("Something went wrong"));
  }

  const changePasswordMutation = useAdd(
    isSelf ? `users/change_password` : `users/${id}/change_password`,
    onMutationSuccess,
    onMutationError
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    changePasswordMutation.mutate(values);
  };

  return (
    <AppDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title={t("Change Password")}
      description={t("Change account password")}
      trigger={children}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {isSelf && (
            <FormField
              control={form.control}
              name="old_password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>{t("Old Password")}</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>{t("New Password")}</FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="new_password_confirmation"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>{t("Confirm New Password")}</FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                {showPassword ? (
                  <EyeOff
                    onClick={() => setShowPassword(false)}
                    className="absolute top-7 w-5 end-4 cursor-pointer hover:text-primary"
                  />
                ) : (
                  <EyeIcon
                    onClick={() => setShowPassword(true)}
                    className="absolute top-7 w-5 end-4 cursor-pointer hover:text-primary"
                  />
                )}
              </FormItem>
            )}
          />
          <Button type="submit">{t("Change Password")}</Button>
        </form>
      </Form>
    </AppDialog>
  );
}
