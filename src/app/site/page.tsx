"use server";

import TitleSection from "@/components/landing-page/title-section";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Banner from "../../../public/appBanner.png";
import Calendar from "../../../public/cal.png";
import CheckIcon from "../../../public/check.svg";
import { CLIENTS, PRICING_CARDS, USERS } from "@/lib/constants";
import ReviewCard from "@/components/landing-page/review-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../../lib/mysql/schema";
import { createConnection } from "mysql2";

const connection = createConnection({
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_DATABASE as string,
});

const db = drizzle(connection, { schema: schema, mode: "default" });

const HomePage = () => {
  const params = {
    heading: "All in one Collaboration and Producitivity platform :)",
    pill: "🪄 This is your personal space to collect data",
  };
  return (
    <>
      <div
        className="overflow-hidden 
        px-4 
        sm:px-6 
        mt-10 
        sm:flex
        sm:flex-col
        gap-7
        md:justify-center
        md:items-center"
      >
        <TitleSection {...params} />
        <div className="bg-white rounded-xl bg-gradient-to-r from-primary to-brand-primaryBlue p-[.2em]  mt-6">
          <Button
            variant="secondary"
            className="w-full bg-background p-6 text-2xl"
          >
            Get your Notan here for free!
          </Button>
        </div>
        <section>
          <Image src={Banner} alt="App Banner"></Image>
        </section>
        <section className="relative w-full flex justify-center mt-5">
          <div
            className="slider 
                overflow-hidden
                flex
                relative
                w-[90%]
                after:absolute
                after:content-['']
                after:top-1 
                after:bg-gradient-to-r
                after:from-background
                after:to-transparent
                after:shadow-xl
                after:w-[100px]
                after:h-[200px]
                after:z-10
                before:absolute
                before:content-['']
                before:top-1 
                before:right-0
                before:rotate-180
                before:bg-gradient-to-r
                before:from-background
                before:to-transparent
                before:shadow-xl
                before:w-[100px]
                before:h-[200px]
                before:z-10"
          >
            <div className="slide-track flex w-[4000px] animate-slide">
              {[...CLIENTS, ...CLIENTS].map((client, index) => (
                <div
                  key={index}
                  className="w-[400px] h-[200px] px-20 flex items-center"
                >
                  <Image
                    src={client.logo}
                    alt={client.alt}
                    key={index}
                    width={400}
                    height={200}
                    className="mx-20"
                  ></Image>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="mt-5 flex justify-center flex-col relative items-center">
          <div className="w-[30%] blur-[120px] rounded-full absolute h-32 bg-brand-primaryPurple/50 -z-10 top-22"></div>
          <TitleSection
            heading="Keep track of your meeting in one place."
            subheading="Capture your ideas and meeting notes in structured and organized."
            pill="Features"
          ></TitleSection>
          <div className="max-w-[450px] flex justify-center  mt-12 rounded-2xl border-8 border-washed-purple-300 border-opacity-10">
            <Image src={Calendar} alt="Calendar" className="rounded-xl"></Image>
          </div>
        </section>
        <section className="my-10 relative flex flex-col justify-center items-center w-full">
          <div className="w-full blur-[120px] rounded-full absolute h-32 bg-brand-primaryPurple/50 -z-10 top-56"></div>
          <TitleSection
            heading="Trusted by all"
            subheading="Join thousands of satsified users."
            pill="Testimonials"
          ></TitleSection>
          {/* TODO: Merge into one array */}
          <div
            className="slider overflow-hidden
                flex
                relative
                w-[90%]"
          >
            <div
              className={
                "mt-12 slide-track flex items-center justify-center gap-6 w-[22800px] animate-[slide_80s_linear_infinite] hover:paused"
              }
            >
              {[...USERS, ...USERS].map((user, index) => (
                <ReviewCard
                  key={index}
                  className="shrink-0s rounded-xl w-[600px] min-h-[220px] bg-gradient-to-t from-border to-background"
                  cardHeader={
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          src={`/avatars/${(index % 19) + 1}.png`}
                        ></AvatarImage>
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                      {user.name}
                    </div>
                  }
                  cardContent={
                    <p className="text-washed-purple-800">{user.message}</p>
                  }
                ></ReviewCard>
              ))}
            </div>
          </div>
          <div
            className="slider overflow-hidden
                flex
                relative
                w-[90%]"
          >
            <div
              className={
                "mt-12 slide-track flex items-center justify-center gap-6 w-[22800px] animate-[slide_80s_linear_infinite_reverse] hover:paused"
              }
            >
              {[...USERS, ...USERS].map((user, index) => (
                <ReviewCard
                  key={index}
                  className="shrink-0s rounded-xl w-[600px] min-h-[220px] bg-gradient-to-t from-border to-background"
                  cardHeader={
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          src={`/avatars/${(index % 19) + 1}.png`}
                        ></AvatarImage>
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                      {user.name}
                    </div>
                  }
                  cardContent={
                    <p className="text-washed-purple-800">{user.message}</p>
                  }
                ></ReviewCard>
              ))}
            </div>
          </div>
        </section>
        <section className="my-10 flex w-full gap-20 justify-center relative">
          {PRICING_CARDS.map((plan, index) => (
            <div className="relative w-[500px] mb-20" key={index}>
              {plan.planType === "Pro Plan" && (
                <div className="block w-full h-12 blur-[70px] bg-brand-primaryPurple/80 absolute -z-10 top-1 right-0"></div>
              )}
              <ReviewCard
                key={index}
                className=" w-[500px] relative p-5 hover:scale-105 transition-transform 
                duration-500 hover:border-spacing-6
              hover:border-brand-primaryPurple hover:bg-opacity-100 z-12"
                cardHeader={
                  <>
                    <div>
                      <div className="text-4xl">{plan.planType}</div>
                    </div>
                  </>
                }
                cardContent={
                  <div>
                    <div className="flex flex-col">
                      <div>
                        <span className="text-2xl">
                          {plan.price}
                          <small className="text-washed-purple-800"> /mo</small>
                        </span>
                      </div>
                      <small className="text-washed-purple-800">
                        {plan.description}
                      </small>
                      <Button
                        variant={"secondary"}
                        className="mt-5 hover:bg-primary animate-in transition-all duration-500 "
                      >
                        {plan.planType === "Pro Plan"
                          ? "Go Pro"
                          : "Get Started"}
                      </Button>
                    </div>
                  </div>
                }
                cardFooter={
                  <ul>
                    {plan.freatures.map((feature, index) => (
                      <li
                        className="list-disc flex items-center gap-2 mt-2"
                        key={index}
                      >
                        <Image
                          src={CheckIcon}
                          alt=""
                          className="fill-black"
                        ></Image>
                        <small>{feature}</small>
                      </li>
                    ))}
                  </ul>
                }
              ></ReviewCard>
            </div>
          ))}
        </section>
      </div>
    </>
  );
};

export default HomePage;
