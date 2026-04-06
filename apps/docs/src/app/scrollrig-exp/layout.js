"use client";
import LenisSmoothScroll from "@/components/SmoothScroll/LenisScroll";
import { GlobalCanvas, SmoothScrollbar } from "@14islands/r3f-scroll-rig";
import { EffectComposer } from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion";
import React from "react";

export default function Layout({ children }) {
    return (
        <>
            <GlobalCanvas
                globalRender={false}
                debug={false}
                dpr={[1, 2]}
                performance={{ min: 0.5 }}
                className="z-990 h-fit w-full"
            >
                <EffectComposer>
                    <Fluid
                        showBackground={false}
                        distortion={.4}
                    />
                </EffectComposer>
            </GlobalCanvas>

            <SmoothScrollbar />

            {children}
        </>
    );
}
