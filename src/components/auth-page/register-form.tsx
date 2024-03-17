"use client";

import Link from "next/link";
import Logo from "../../../public/Notan.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import Loader from "../loader";
import { Button } from "../ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/lib/types";

const RegisterForm = () => {
  const [submitError, setSubmitError] = useState("");
  const router = useRouter();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    mode: "onChange",
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const onSubmit: SubmitHandler<z.infer<typeof RegisterSchema>> = async (
    formData
  ) => {
    console.log("lesgo");
    router.replace("/dashboard");
  };

  return (
    <div className="h-[100%]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onChange={() => submitError && setSubmitError("")}
          className="h-[100%] flex items-center justify-center flex-col border-brand-primaryPurple border-2  rounded-xl p-16"
        >
          <Link href="/">
            <Image className="w-auto max-h-60" src={Logo} alt="Notan"></Image>
          </Link>
          <FormDescription>Create account for free</FormDescription>
          <FormField
            disabled={isSubmitting}
            control={form.control}
            name="username"
            render={(field) => (
              <FormItem className="mt-10 w-full">
                <FormControl>
                  <Input
                    type="username"
                    placeholder="Username"
                    {...field}
                  ></Input>
                </FormControl>
              </FormItem>
            )}
          ></FormField>
          <FormField
            disabled={isSubmitting}
            control={form.control}
            name="email"
            render={(field) => (
              <FormItem className="mt-10 w-full">
                <FormControl>
                  <Input type="email" placeholder="Email" {...field}></Input>
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
          <FormField
            disabled={isSubmitting}
            control={form.control}
            name="confirmPassword"
            render={(field) => (
              <FormItem className="mt-10 w-full">
                <FormControl>
                  <Input
                    type="confirmPassword"
                    placeholder="confirmPassword"
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
            {!isSubmitting ? "Register" : <Loader />}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
