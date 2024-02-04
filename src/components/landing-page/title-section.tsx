import React from "react";

type TitleSectionProps = {
  heading?: string;
  subheading?: string;
  pill?: string;
};

const TitleSection: React.FC<TitleSectionProps> = ({
  heading,
  subheading,
  pill,
}) => {
  return (
    <section
      className="flex
      flex-col
      gap-7
      justify-center
      items-start
      md:items-center"
    >
      {pill && (
        <article
          className="rounded-full 
        p-[.15em]
        text-sm
        dark:bg-gradient-to-r
        dark:from-brand-primaryBlue
        dark:to-brand-primaryPurple"
        >
          (
          <div className="rounded-full dark:bg-black p-[.7em] flex justify-center">
            {pill}
          </div>
          )
        </article>
      )}
      <h1 className="text-left text-6xl font-semibold">{heading}</h1>
      {subheading ? (
        <>
          <p className="text-left text-xl font-light">{subheading}</p>
        </>
      ) : (
        ""
      )}
    </section>
  );
};

export default TitleSection;
