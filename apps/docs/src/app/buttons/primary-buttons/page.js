import ArrowBgFillPrimaryBtn from "@/components/Buttons/PrimaryButtons/ArrowBgFillPrimaryBtn/ArrowBgFillPrimaryBtn";
import CharStaggerPrimaryBtn from "@/components/Buttons/PrimaryButtons/CharStaggerPrimaryBtn/CharStaggerPrimaryBtn";
import DotScaleFillCharBtn from "@/components/Buttons/PrimaryButtons/DotBgFillPrimaryBtn/DotBgFillPrimaryBtn";

import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <>
      <section className="w-full h-screen py-[10vw]  text-white  relative">
        <div className="relative  h-full z-[1] flex flex-col justify-center items-center gap-[10vw]">
          <h1 className="text-[4.5vw] max-sm:text-[9.5vw] font-medium">
            Primary Buttons
          </h1>
          <div className="w-screen h-fit flex justify-center gap-[7vw] max-sm:flex-col max-sm:items-center ">
            <div>
              <CharStaggerPrimaryBtn
                href="#"
                text="Hover me"
                bgClassName="rounded-full bg-[#ff6b00]"
                // hoverColor="#ff6b00"
                className="text-[1.2vw] max-sm:text-[4.5vw]"
              />
            </div>
            <div>
              <ArrowBgFillPrimaryBtn
                className="bg-[#ff6b00]"
                href="#"
                btnText="Hover me"
                data-thankyou
              />
            </div>
            <div>
              <DotScaleFillCharBtn
                href="#"
                btnText="Hover me"
                bgColor="#ff6b00"
                textColor="#ffffff"
                fillColor="#ffffff"
                hoverTextColor="#ff6b00"
              />
            </div>
          </div>
        </div>
        <div className="fixed inset-0 w-full h-full">
          <Image
            src={"/assets/buttonbg/primary-btn-bg.jpg"}
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
