import CharStaggerLinkBtn from "@/components/Buttons/CharStaggerLinkBtn/CharStaggerLinkBtn";
import LinkButton from "@/components/Buttons/LinkButton/LinkButton";
import ScrambleLinkButton from "@/components/Buttons/ScrambleLinkButton/ScrambleLinkButton";
import React from "react";

const page = () => {
  return (
    <>
      <section className="w-full h-screen py-[10vw] flex flex-col justify-center items-center bg-black text-white gap-[10vw]">
        <h1 className="text-[4vw] max-sm:text-[9.5vw]">Link Buttons</h1>
        <div className="w-screen h-fit flex justify-center gap-[7vw] max-sm:flex-col max-sm:items-center ">
          <LinkButton
            text={"Hover me"}
            href="#"
            iconClassName="size-[2vw] mt-[0.2vw] max-sm:size-[4vw]"
            className="hover:text-[#ff6b00] text-[2vw] max-sm:text-[4.5vw] "
          />

          <CharStaggerLinkBtn
            href="#"
            showLine
            text="Hover me"
            hoverColor="#ff6b00"
            className="text-[2vw] max-sm:text-[4.5vw]"
          />

          <CharStaggerLinkBtn
            href="#"
            showLine
            showArrow
            text="Hover me"
            iconClassName="size-[2vw] max-sm:size-[4.5vw]"
            hoverColor="#ff6b00"
            className="text-[2vw] max-sm:text-[4.5vw]"
          />
          <ScrambleLinkButton
            href="#"
            text="Hover me"
            className="text-[2vw] max-sm:text-[4.5vw]"
          />
        </div>
      </section>
    </>
  );
};

export default page;
