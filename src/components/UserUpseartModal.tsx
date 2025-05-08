import { IUser } from "@/types/generalTypes";
import AppDialog from "./AppDialog";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import useAdd from "@/react-query/useAdd";
import { onError, onSuccess } from "@/helpers/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { FormLabel, FormMessage } from "./ui/form";
import { useState } from "react";
import { Input } from "./ui/input";
import useUpdate from "@/react-query/useUpdate";
import { useQueryClient } from "@tanstack/react-query";
import { RoleTypeEnum } from "@/types/authTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { EyeIcon, EyeOff } from "lucide-react";

export function UserUpsearModal({
  isOpen,
  setIsOpen,
  selectedRecord,
  isSelf = false,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedRecord: IUser | null;
  isSelf?: boolean;
}) {
  const [t] = useTranslation("global");

  return (
    <AppDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title={selectedRecord ? t("Update User") : t("Create User")}
      description={
        selectedRecord ? t("Update the selected user") : t("Create a new user")
      }
    >
      <UpsertUser
        setIsOpen={setIsOpen}
        selectedRecord={selectedRecord}
        isSelf={isSelf}
      />
    </AppDialog>
  );
}
function UpsertUser({
  setIsOpen,
  selectedRecord,
  isSelf = false,
}: {
  setIsOpen: (isOpen: boolean) => void;
  selectedRecord: IUser | null;
  isSelf?: boolean;
}) {
  const [t] = useTranslation("global");
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const roleOptions = Object.values(RoleTypeEnum).filter(
    (role) => role != RoleTypeEnum.SUPERADMIN
  ) as [string, ...string[]];
  const formSchema = z
    .object({
      name: z.string().min(1, t("User name is required")),
      username: z.string().min(1, t("Username is required")),
      role: isSelf
        ? z.string().optional()
        : z.enum(roleOptions, {
            required_error: t("Role is required"),
          }),
      password: selectedRecord
        ? z
            .string()
            .optional()
            .refine(
              (val) =>
                !val ||
                (val.length >= 8 &&
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val)),
              {
                message: t(
                  "Password must be at least 8 characters and include uppercase, lowercase, and a number"
                ),
              }
            )
        : z
            .string()
            .refine(
              (val) =>
                !val ||
                (val.length >= 8 &&
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val)),
              {
                message: t(
                  "Password must be at least 8 characters and include uppercase, lowercase, and a number"
                ),
              }
            ),
      confirmPassword: selectedRecord ? z.string().optional() : z.string(),
    })
    .refine(
      (data) => data.password === data.confirmPassword || selectedRecord,
      {
        message: t("Passwords must match"),
        path: ["confirmPassword"],
      }
    );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: selectedRecord
      ? {
          name: selectedRecord.name,
          username: selectedRecord.username,
          role: selectedRecord.role,
        }
      : {},
  });

  const addMutation = useAdd(
    "users",
    () => {
      onSuccess(t("User Added Successfully"));
      queryClient.refetchQueries({
        queryKey: ["users"],
        exact: false,
      });
      setIsOpen(false);
      form.reset();
    },
    () => onError(t("There was an error adding the user"))
  );

  const updateTagMutation = useUpdate(
    "users",
    () => {
      onSuccess(t("User Updated Successfully"));
      setIsOpen(false);
      queryClient.refetchQueries({
        queryKey: ["users"],
        exact: false,
      });
      form.reset();
    },
    () => onError(t("There was an error updating the user"))
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    selectedRecord
      ? updateTagMutation.mutate({ id: selectedRecord.id + "", data: values })
      : addMutation.mutate(values);
  };

  const roles = roleOptions.map((role, index) => {
    return (
      <SelectItem value={role} key={index + "role"}>
        {t(role)}
      </SelectItem>
    );
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("Name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Username")}</FormLabel>
              <FormControl>
                <Input placeholder={t("Username")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isSelf && (
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Role")}</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("Select a Role")} />
                    </SelectTrigger>
                    <SelectContent>{roles}</SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {!selectedRecord ? (
          <>
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
              name="confirmPassword"
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
          </>
        ) : null}

        <Button type="submit">
          {selectedRecord ? t("Updated User") : t("Add User")}
        </Button>
      </form>
    </Form>
  );
}
