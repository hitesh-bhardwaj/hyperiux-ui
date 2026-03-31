import OverFlowAnim from "@/components/TextAnimations/OverFlowAnim/OverFlowAnim";
import OverFlowStagAnim from "@/components/TextAnimations/OverFlowStagAnim/OverFlowStagAnim";
import React from "react";
import { ReactLenis } from "lenis/react";
import RightSlideAnim from "@/components/TextAnimations/RightSlideAnim/RightSlideAnim";
import MaskAnim from "@/components/TextAnimations/MaskAnim/MaskAnim";
import PerspectiveAnim from "@/components/TextAnimations/PerspectiveAnim/PerspectiveAnim";
import "./page.css";

const page = () => {
  return (
    <ReactLenis root>
      <section className="text-anims-page">
        <div className="text-anims-hero">
          <div className="text-anims-hero__inner">
            <MaskAnim scrub={false}>
              <h1 className="text-anims-hero__title">Text Animations</h1>
            </MaskAnim>
            <OverFlowAnim scrub={false} delay={0.5}>
              <p className="">Scroll and Select Ones You Like</p>
            </OverFlowAnim>
          </div>
        </div>

        <div className="text-anims-sections">
          <div className="text-anims-block text-anims-block--green">
            <div className="text-anims-block__inner">
              <OverFlowStagAnim>
                <h2 className="text-anims-block__title text-anims-block__title--dark-green">
                  OverFlow Stagger Text Animation
                </h2>
              </OverFlowStagAnim>
            </div>
          </div>

          <div className="text-anims-block text-anims-block--olive">
            <div className="text-anims-block__inner">
              <RightSlideAnim>
                <h2 className="text-anims-block__title text-anims-block__title--forest">
                  Right Slide Stagger Text Animation
                </h2>
              </RightSlideAnim>
            </div>
          </div>

          <div className="text-anims-block text-anims-block--cream">
            <div className="text-anims-block__inner">
              <MaskAnim>
                <h2 className="text-anims-block__title text-anims-block__title--brown">
                  Masking Text Animation
                </h2>
              </MaskAnim>
            </div>
          </div>

          <div className="text-anims-block text-anims-block--offwhite">
            <div className="text-anims-block__inner">
              <PerspectiveAnim>
                <h2 className="text-anims-block__title text-anims-block__title--navy">
                  Perspective Text Animation
                </h2>
              </PerspectiveAnim>
            </div>
          </div>

          <div className="text-anims-block text-anims-block--light text-anims-block--last">
            <div className="text-anims-block__inner">
              <OverFlowAnim>
                <p className="text-anims-block__para">
                  This is a normal text animation from overflow hidden which is
                  so clean you'll like it for sure
                </p>
              </OverFlowAnim>
            </div>
          </div>
        </div>
      </section>
    </ReactLenis>
  );
};

export default page;
