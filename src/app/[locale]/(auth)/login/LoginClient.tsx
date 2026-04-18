"use client";

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
import { Input } from "@/components/ui/input";
import useLogin from "@/react-query/auth/useLogin";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { EyeIcon, EyeOff, Lock, User, AtSign } from "lucide-react";
import { ILogin, ILoginP } from "@/types/authTypes";
import { saveToken } from "@/helpers/localStorage";
import { AxiosError } from "axios";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";

export default function LoginClient() {
  const [t] = useTranslation("global");
  const router = useRouter();
  const { locale } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuthStore();

  const loginSchema = z.object({
    username: z
      .string({ required_error: t("Required") })
      .min(1, t("Required")),
    password: z
      .string({ required_error: t("Required") })
      .min(1, t("Required")),
  });

  async function onSuccess(data: ILogin) {
    saveToken(data.token);
    setUser(data.user);
    router.push(`/${locale}`);
  }

  function onError(error: AxiosError<ILogin>) {
    //@ts-ignore
    toast.error(error.response?.data.message || t("Something went wrong"));
  }

  const loginMutation = useLogin(onSuccess, onError);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: FieldValues) => {
    loginMutation.mutate(data as ILoginP);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-6 bg-background">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[400px] z-10"
      >
        <div className="bg-card border border-border shadow-sm rounded-xl p-8 md:p-10">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {t("Login")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("Welcome back to Our Quran")}
            </p>
          </motion.div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium mb-1.5 flex items-center gap-2">
                        <AtSign className="w-4 h-4 opacity-50" />
                        {t("Username")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("Enter your username")}
                          className="h-11 bg-background border-border focus:ring-1 focus:ring-primary transition-all rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="text-sm font-medium mb-1.5 flex items-center gap-2">
                        <Lock className="w-4 h-4 opacity-50" />
                        {t("Password")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={t("Enter your password")}
                            className="h-11 bg-background border-border focus:ring-1 focus:ring-primary transition-all rounded-lg pe-11"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 end-0 px-3 flex items-center text-muted-foreground hover:text-primary transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <EyeIcon className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="mt-2">
                <Button
                  className="w-full h-11 text-base font-semibold rounded-lg transition-all"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? t("Logging in...") : t("Login")}
                </Button>
              </motion.div>
            </form>
          </Form>

          <motion.div
            variants={itemVariants}
            className="mt-8 pt-6 border-t border-border text-center"
          >
            <p className="text-sm text-muted-foreground">
              {t("Don't have an account?")}{" "}
              <Link
                href={`/${locale}/signup`}
                className="text-primary font-semibold hover:underline underline-offset-4"
              >
                {t("Sign up")}
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
