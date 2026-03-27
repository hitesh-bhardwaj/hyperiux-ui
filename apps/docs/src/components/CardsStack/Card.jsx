"use client";

import Image from "next/image";

export const SliderCard = ({
  id,
  category,
  title,
  description,
  image,
  backgroundColor,
}) => {
  return (
    <div
      className={`flex h-full w-full max-sm:py-10 shrink-0 items-stretch justify-between overflow-hidden origin-center ${backgroundColor}
      max-sm:flex-col`}
    >
      {/* LEFT CONTENT */}
      <div
        className="flex h-full w-[55%] flex-col justify-between px-[2vw] py-[4vw]
        max-sm:w-full max-sm:px-[5vw] max-sm:py-[6vw]"
      >
        {/* CATEGORY */}
        <div>
          <h2
            className="mb-[2vw] text-[7vw] text-black font-third
            max-sm:text-[10vw] max-sm:mb-[4vw]"
          >
            {category}
          </h2>
        </div>

        {/* IMAGE (ONLY MOBILE POSITION) */}
        <div
          className="hidden max-sm:block w-full h-[40vh] mb-[5vw]"
        >
          <div className="h-full w-full overflow-hidden rounded-[4vw]">
            <Image
              width={1000}
              height={1000}
              src={image}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* ID + CONTENT */}
        <div
          className="flex justify-between gap-[12vw]
          max-sm:flex-col max-sm:gap-[6vw]"
        >
          <div
            className="mb-[3vw] w-fit text-[8vw] leading-none text-black
            max-sm:text-[12vw] max-sm:mb-[2vw]"
          >
            {id}
          </div>

          <div
            className="flex flex-grow flex-col justify-center space-y-[2vw]
            max-sm:space-y-[3vw]"
          >
            <h3
              className="font-display text-[2.5vw] text-black leading-[1.2]
              max-sm:text-[5vw]"
            >
              {title}
            </h3>
            <p
              className="text-[1.4vw] leading-[1.2] text-gray-700
              max-sm:text-[3.5vw]"
            >
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* DESKTOP IMAGE (UNCHANGED) */}
      <div
        className="my-auto h-[75%] w-[40%] p-[4vw]
        max-sm:hidden"
      >
        <div className="h-full w-full overflow-hidden rounded-[2vw]">
          <Image
            width={1000}
            height={1000}
            src={image}
            alt={title}
            className="card-image h-full w-full rounded-[2vw] object-cover"
          />
        </div>
      </div>
    </div>
  );
};