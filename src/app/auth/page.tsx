"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/auth-page/login-form";
import RegisterForm from "@/components/auth-page/register-form";
import TitleSection from "@/components/landing-page/title-section";

const LoginPage = () => {
  const [loginView, setloginView] = useState(true);

  return (
    <div className="flex flex-row items-center justify-center w-[50%] h-[70%]">
      <div className={`relative w-[100%] h-[100%] flex items-center `}>
        <div className="w-[50%] h-[100%]">
          <RegisterForm />
        </div>
        <div className="w-[50%] h-[100%]">
          <LoginForm />
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
