"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema } from "../../../lib/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import Logo from "../../../../public/Notan.png";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";
import { loginUser } from "@/lib/server-action/auth-actions";
import { AuthError } from "@supabase/supabase-js";

const LoginPage = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const [registerLogin, setRegisterLogin] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: { email: "", password: "" },
  });

  const isSubmitting = form.formState.isSubmitting;
  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (
    formData
  ) => {
    const { error } = await loginUser(formData);
    if (error) {
      form.reset();
      setSubmitError(error.message);
    }
    router.replace("/dashboard");
  };
  return (
    <div className="flex flex-row items-center justify-center w-[60%] h-[70%]  transition-all ease-in-out duration-3000">
      <Button
        className="absolute top-[50%] right-[50%] z-10"
        onClick={() => setRegisterLogin((prev) => !prev)}
      ></Button>
      {registerLogin ? (
        <div
          className={`w-[100%] h-[100%] flex items-center transition-all ease-in-out duration-3000 ${
            registerLogin ? "opacity-1" : "opacity-0"
          }`}
        >
          <div className="w-[50%] h-[100%]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                onChange={() => submitError && setSubmitError("")}
                className="flex items-center justify-center flex-col border-brand-primaryPurple border-2 rounded-xl p-16 h-[100%]"
              >
                <span>Login here!</span>
                <Link href="/">
                  <Image
                    className="w-auto max-h-60"
                    src={Logo}
                    alt="Notan"
                  ></Image>
                </Link>
                <FormDescription>
                  Colaborate and be productive with Notan
                </FormDescription>
                <FormField
                  disabled={isSubmitting}
                  control={form.control}
                  name="email"
                  render={(field) => (
                    <FormItem className="mt-10 w-full">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email"
                          {...field}
                        ></Input>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isSubmitting}
                  control={form.control}
                  name="password"
                  render={(field) => (
                    <FormItem className="w-full mt-10">
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        ></Input>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                {submitError && <FormMessage>{submitError}</FormMessage>}
                <Button
                  variant="default"
                  type="submit"
                  className="w-full p-6 mt-10 hover:scale-105 transition-all duration-1000 animate-in"
                  size="lg"
                >
                  {!isSubmitting ? "Login" : <Loader />}
                </Button>
                <span className="mt-3">
                  {"Don't have account? "}
                  <Link href="/signup" className="text-primary">
                    Sign up here
                  </Link>
                </span>
              </form>
            </Form>
          </div>
          <div className="w-[50%] h-[100%] bg-white"></div>
        </div>
      ) : (
        <div
          className={`w-[100%] h-[100%] flex items-center transition-all ease-in-out duration-3000 ${
            registerLogin ? "opacity-1" : "opacity-0"
          }`}
        >
          <div className="w-[50%] h-[100%] bg-white"></div>
          <div className="w-[50%] h-[100%]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                onChange={() => submitError && setSubmitError("")}
                className="flex items-center justify-center flex-col border-brand-primaryPurple border-2 rounded-xl p-16 h-[100%]"
              >
                <span>Signup here!</span>
                <Link href="/">
                  <Image
                    className="w-auto max-h-60"
                    src={Logo}
                    alt="Notan"
                  ></Image>
                </Link>
                <FormDescription>
                  Colaborate and be productive with Notan
                </FormDescription>
                <FormField
                  disabled={isSubmitting}
                  control={form.control}
                  name="email"
                  render={(field) => (
                    <FormItem className="mt-10 w-full">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email"
                          {...field}
                        ></Input>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isSubmitting}
                  control={form.control}
                  name="password"
                  render={(field) => (
                    <FormItem className="w-full mt-10">
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        ></Input>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                {submitError && <FormMessage>{submitError}</FormMessage>}
                <Button
                  variant="default"
                  type="submit"
                  className="w-full p-6 mt-10 hover:scale-105 transition-all duration-1000 animate-in"
                  size="lg"
                >
                  {!isSubmitting ? "Login" : <Loader />}
                </Button>
                <span className="mt-3">
                  {"Don't have account? "}
                  <Link href="/signup" className="text-primary">
                    Sign up here
                  </Link>
                </span>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
