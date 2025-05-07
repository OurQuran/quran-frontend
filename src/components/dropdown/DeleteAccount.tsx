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
import { onError } from "@/helpers/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppDialog from "../AppDialog";
import { EyeIcon, EyeOff } from "lucide-react";
import { Input } from "../ui/input";
import useAdd from "@/react-query/useAdd";
import { destroyToken } from "@/helpers/localStorage";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/authStore";

export default function DeleteAccoun({
  children,
  isOpen,
  setIsOpen,
}: {
  children?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [t] = useTranslation("global");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const authStore = useAuthStore();

  const formSchema = z
    .object({
      password: z.string(),
      password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t("Passwords must match"),
      path: ["password_confirmation"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onMutationSuccess() {
    destroyToken();
    authStore.reset();
    navigate("/login");
  }
  function onMutationError() {
    onError(t("Something went wrong"));
  }

  const deleteAccountMutation = useAdd(
    "me",
    onMutationSuccess,
    onMutationError
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    deleteAccountMutation.mutate(values);
  };

  return (
    <AppDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title={t("Delete Account")}
      description={t(
        "Are you sure you want to delete your account? \n write your password to confirm"
      )}
      trigger={children}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>{t("Password")}</FormLabel>
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
            name="password_confirmation"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>{t("Confirm Password")}</FormLabel>
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
          <Button variant={"destructive"} type="submit">
            {t("Delete Account")}
          </Button>
        </form>
      </Form>
    </AppDialog>
  );
}
