import React from "react";
import SquareTranslate from "@/components/scroll-based-animations/SquareTranslate";
import LenisSmoothScroll from "@/components/SmoothScroll/LenisScroll";
import Image from "next/image";

const items = [
    "Websites, web apps, landing pages",
    "Animation and interaction design",
    "Figma to production code",
    "Core Web Vitals and load time optimization",
    "Webflow development",
    "React / Next.js / Vue / Nuxt development",
    "GSAP / Framer Motion animation",
    "Unlimited revisions",
    "Direct Slack communication",
    "Senior developers on every project",
];

export default function page() {
    return (
        <>
            <LenisSmoothScroll
                // duration={0.75}
                // lerp={0.01}
                // smoothWheel={true}
                // wheelMultiplier={1}
                // touchMultiplier={1.5}
            />
            <div className="h-fit w-screen bg-[#eeeeee] px-[8vw] py-[10vw]">
                <div className="h-fit py-[2vw] w-[80%] mx-auto mb-[5vw] flex items-center justify-center  text-center font-mono text-[1.5vw] px-[4vw] rounded-xl bg-black ">
                    <p>
                        A scroll-driven list with a rotating square indicator that follows your scroll position.
                    </p>
                </div>
                <h2>
                    <span className="text-[5vw] font-medium text-black ">What's included</span>
                    <span className="text-[#FB450F] font-mono uppercase ml-[2vw] text-[1.2vw]">// Services</span>
                </h2>
                <div className="h-fit w-full py-[10vh] flex items-center gap-[6vw] ">
                    <div className="h-[35vw] w-[40vw] bg-red-500">
                        <Image
                            src="https://cdn.sanity.io/images/degpnzrx/production/b370e4f512a2d26bb53dd93bc1d84b473ffcb988-2400x1600.heif?w=2400&h=1600&q=90&fit=crop&auto=format"
                            width={1000}
                            height={1000}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* SquareTranslate: A scroll-driven animation component that displays a list of items with a small square indicator that travels down the list as you scroll. The square scales in/out at the start/end and rotates during movement. Items near the current position translate horizontally based on proximity, creating a dynamic "following" effect. */}
                    <SquareTranslate
                        items={items}
                        textClassName="text-[1.1vw]"
                        textColor="text-black"
                        squareClassName="w-[.6vw] h-[.6vw] bg-[#FB450F]"
                        containerClassName="w-[50vw]"
                        translateValue={50}
                        borderColor="border-black/10"
                        totalTranslateImpact={3}
                    />
                </div>
                <div className="h-[20vh] bg-[#eeeeee] mb-[5vw] relative flex  items-center justify-center w-full ">
                    <div className="h-[10vw] w-[80%] flex items-center justify-center  text-center font-mono text-[1.5vw] px-[4vw] rounded-xl bg-black translate-y-[10vw]">
                        <p>
                           Hope you like it!
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
