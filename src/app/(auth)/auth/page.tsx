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
import LoginForm from "@/components/auth-page/login-form";
import RegisterForm from "@/components/auth-page/register-form";
import TitleSection from "@/components/landing-page/title-section";

const LoginPage = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const [loginView, setloginView] = useState(true);
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
    <div className="flex flex-row items-center justify-center w-[50%] h-[70%]">
      <div className={`relative w-[100%] h-[100%] flex items-center `}>
        <div className="w-[50%] h-[100%]">
          <LoginForm />
        </div>
        <div className="w-[50%] h-[100%]">
          <RegisterForm />
        </div>
        <div
          className={`flex justify-center items-center flex-row gap-7 absolute w-[50%] h-[100%] bg-background top-0 bottom-0 left-0 r-0 m-auto transition-all ease-in-out duration-700 ${
            loginView
              ? "translate-x-0 border-r-0 rounded-l-3xl shadow-[-14px_0px_2px_15px_#7000FF]"
              : " translate-x-full border-l-0 rounded-r-3xl shadow-[14px_0px_2px_15px_#7000FF]"
          } `}
        >
          <div className="flex items-center justify-end flex-col gap-7 p-7">
            <>
              {loginView ? (
                <TitleSection subheading="Don't have account? Click below to create an account and to use freely best notetaking app"></TitleSection>
              ) : (
                <TitleSection subheading="Have an account login by clicking button below"></TitleSection>
              )}
            </>
            <Button
              className=" z-20 max-w-[200px]"
              onClick={() => setloginView((prev) => !prev)}
            >
              {loginView ? "Register" : "Login"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
