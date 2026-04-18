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
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { EyeIcon, EyeOff, Lock, User, UserPlus, AtSign, Contact, ShieldCheck } from "lucide-react";
import { ILogin, IRegister, RoleTypeEnum } from "@/types/authTypes";
import { saveToken } from "@/helpers/localStorage";
import { AxiosError } from "axios";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import useAdd from "@/react-query/useAdd";
import { motion } from "framer-motion";

export default function SignUpClient() {
  const [t] = useTranslation("global");
  const router = useRouter();
  const { locale } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuthStore();

  const formSchema = z
    .object({
      username: z
        .string({ required_error: t("Required") })
        .min(8, t("Username must be at least 8 characters"))
        .max(30, t("Username must not exceed 30 characters"))
        .regex(
          /^[a-zA-Z0-9_]+$/,
          t("Username can only contain letters, numbers, and underscores"),
        ),
      name: z
        .string({ required_error: t("Required") })
        .min(2, t("Name must be at least 2 characters"))
        .max(50, t("Name must not exceed 50 characters"))
        .regex(/^[a-zA-Z\s]+$/, t("Name can only contain letters and spaces")),
      password: z
        .string({ required_error: t("Required") })
        .min(8, t("Password must be at least 8 characters"))
        .max(100, t("Password must not exceed 100 characters"))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          t(
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
          ),
        ),
      confirmPassword: z
        .string({ required_error: t("Required") })
        .min(1, t("Please confirm your password")),
      role: z
        .string({ required_error: t("Required") })
        .min(1, t("Please select a role"))
        .default(RoleTypeEnum.USER)
        .refine(
          (val) => Object.values(RoleTypeEnum).includes(val as RoleTypeEnum),
          {
            message: t("Invalid role selected"),
          },
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("Passwords do not match"),
    });

  async function onSuccess(data: { data: ILogin }) {
    saveToken(data.data.token);
    setUser(data.data.user);
    router.push(`/${locale}`);
  }

  function onError(error: AxiosError<ILogin>) {
    //@ts-ignore
    toast.error(error.response?.data.message || t("Something went wrong"));
  }

  const signupMutation = useAdd<IRegister>("signup", onSuccess, onError);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: FieldValues) => {
    signupMutation.mutate(data as IRegister);
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
        className="w-full max-w-[480px]"
      >
        <div className="bg-card border border-border shadow-sm rounded-xl p-8 md:p-10">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {t("Sign Up")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("Join our Quranic community today")}
            </p>
          </motion.div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium mb-1.5 flex items-center gap-2">
                          <Contact className="w-4 h-4 opacity-50" />
                          {t("Full Name")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("Enter your full name")}
                            className="h-11 bg-background border-border focus:ring-1 focus:ring-primary transition-all rounded-lg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] mt-1" />
                      </FormItem>
                    )}
                  />
                </motion.div>

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
                        <FormMessage className="text-[10px] mt-1" />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>

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
                      <FormMessage className="text-[10px] mt-1" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="text-sm font-medium mb-1.5 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 opacity-50" />
                        {t("Confirm Password")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={t("Please confirm your password")}
                          className="h-11 bg-background border-border focus:ring-1 focus:ring-primary transition-all rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] mt-1" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="mt-2">
                <Button
                  className="w-full h-11 text-base font-semibold rounded-lg transition-all"
                  disabled={signupMutation.isPending}
                >
                  {signupMutation.isPending
                    ? t("Creating account...")
                    : t("Create Account")}
                </Button>
              </motion.div>
            </form>
          </Form>

          <motion.div
            variants={itemVariants}
            className="mt-8 pt-6 border-t border-border text-center"
          >
            <p className="text-sm text-muted-foreground">
              {t("Already have an account?")}{" "}
              <Link
                href={`/${locale}/login`}
                className="text-primary font-semibold hover:underline underline-offset-4"
              >
                {t("Login")}
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
