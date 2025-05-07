import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useLogin from "@/react-query/auth/useLogin";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { EyeIcon, EyeOff } from "lucide-react";
import { ILogin, ILoginP, RoleTypeEnum } from "@/types/authTypes";
import { saveToken } from "@/helpers/localStorage";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/authStore";

export default function SignUp() {
  const [t] = useTranslation("global");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuthStore();

  const formSchema = z
    .object({
      username: z
        .string()
        .min(8, t("Username must be at least 8 characters"))
        .max(30, t("Username must not exceed 30 characters"))
        .regex(
          /^[a-zA-Z0-9_]+$/,
          t("Username can only contain letters, numbers, and underscores")
        ),
      name: z
        .string()
        .min(2, t("Name must be at least 2 characters"))
        .max(50, t("Name must not exceed 50 characters"))
        .regex(/^[a-zA-Z\s]+$/, t("Name can only contain letters and spaces")),
      password: z
        .string()
        .min(8, t("Password must be at least 8 characters"))
        .max(100, t("Password must not exceed 100 characters"))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          t(
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
          )
        ),
      confirmPassword: z.string().min(1, t("Please confirm your password")),
      role: z
        .string()
        .min(1, t("Please select a role"))
        .default(RoleTypeEnum.USER)
        .refine(
          (val) => Object.values(RoleTypeEnum).includes(val as RoleTypeEnum),
          {
            message: t("Invalid role selected"),
          }
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("Passwords do not match"),
    });

  async function onSuccess(data: ILogin) {
    saveToken(data.token);
    setUser(data.user);
    navigate("/");
  }

  function onError(error: AxiosError<ILogin>) {
    //@ts-ignore
    toast.error(error.response?.data.message);
  }

  const loginMutation = useLogin(onSuccess, onError);

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FieldValues) => {
    loginMutation.mutate(data as ILoginP);
  };

  return (
    <div className="flex items-center w-full justify-center h-screen">
      <Card className="mx-auto w-[380px]  ">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{t("Sign Up")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm  flex items-end justify-between">
                      <div>{t("Name")}</div>
                    </FormLabel>
                    <FormControl>
                      <Input className="sm:p-5" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500">
                      {fieldState.error?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm  flex items-end justify-between">
                      <div>{t("Username")}</div>
                    </FormLabel>
                    <FormControl>
                      <Input className="sm:p-5" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500">
                      {fieldState.error?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem className="relative">
                    <FormLabel className="text-sm  flex items-end justify-between">
                      <div>{t("Password")}</div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="sm:p-5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500">
                      {fieldState.error?.message}
                    </FormMessage>
                    {showPassword ? (
                      <EyeOff
                        onClick={() => setShowPassword(false)}
                        className="absolute top-10 w-5 h-5 end-4 cursor-pointer hover:text-primary"
                      />
                    ) : (
                      <EyeIcon
                        onClick={() => setShowPassword(true)}
                        className="absolute top-10 w-5 h-5 end-4 cursor-pointer hover:text-primary"
                      />
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <FormItem className="relative">
                    <FormLabel className="text-sm  flex items-end justify-between">
                      <div>{t("Confirm Password")}</div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="sm:p-5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500">
                      {fieldState.error?.message}
                    </FormMessage>
                    {showPassword ? (
                      <EyeOff
                        onClick={() => setShowPassword(false)}
                        className="absolute top-10 w-5 h-5 end-4 cursor-pointer hover:text-primary"
                      />
                    ) : (
                      <EyeIcon
                        onClick={() => setShowPassword(true)}
                        className="absolute top-10 w-5 h-5 end-4 cursor-pointer hover:text-primary"
                      />
                    )}
                  </FormItem>
                )}
              />
              <Button variant={"default"} type="submit">
                {t("Sign Up")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
