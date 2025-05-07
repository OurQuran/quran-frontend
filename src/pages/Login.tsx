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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useLogin from "@/react-query/auth/useLogin";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { EyeIcon, EyeOff } from "lucide-react";
import { ILogin, ILoginP } from "@/types/authTypes";
import { saveToken } from "@/helpers/localStorage";
import { AxiosError } from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "@/store/authStore";

export default function Login() {
  const [t] = useTranslation("global");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuthStore();

  const loginSchema = z.object({
    username: z.string().min(1, t("Required")),
    password: z.string().min(1, t("Required")),
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
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "superadmin",
      password: "superadmin123",
    },
  });

  const onSubmit = (data: FieldValues) => {
    loginMutation.mutate(data as ILoginP);
  };

  return (
    <div className="flex items-center w-full justify-center h-screen">
      <Card className="mx-auto w-[380px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{t("Login")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base flex items-end justify-between">
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
                    <FormLabel className="text-sm sm:text-base flex items-end justify-between">
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
              <Button variant={"default"} type="submit">
                {t("Login")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm">
            {t("Don't have an account?")}{" "}
            <Link to="/signup" className="text-primary hover:underline">
              {t("Sign up")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
