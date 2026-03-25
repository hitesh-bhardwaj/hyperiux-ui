import CharStaggerLinkBtn from "@/components/Buttons/LinkButtons/CharStaggerLinkBtn/CharStaggerLinkBtn";
import LinkButton from "@/components/Buttons/LinkButtons/LinkButton/LinkButton";
import ScrambleLinkButton from "@/components/Buttons/LinkButtons/ScrambleLinkButton/ScrambleLinkButton";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <>
      <section className="w-full h-screen py-[10vw]  text-white  relative">
        <div className="relative  h-full z-[1] flex flex-col justify-center items-center gap-[10vw]">
          <h1 className="text-[4.5vw] max-sm:text-[9.5vw] font-medium">Link Buttons</h1>
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
        </div>
        <div className="fixed inset-0 w-full h-full">
          <Image
            src={"/assets/buttonbg/bg-img.jpg"}
            alt="btn-bg"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
        </div>
      </section>
    </>
  );
};

export default page;
