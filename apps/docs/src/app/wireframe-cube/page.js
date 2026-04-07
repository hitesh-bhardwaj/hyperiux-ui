// app/page.jsx or wherever you want to call it
// import StickyPointPlaneSection from "@/components/StickyPointPlaneSection";

import StickyPointPlaneSection from "@/components/StickyPointPlaneSection/StickyPointPlaneSection";
import { ReactLenis } from "lenis/react";

export default function Page() {
  return (
    // <main className="bg-black">
    <ReactLenis root >
      <section className="w-screen h-fit">
        <StickyPointPlaneSection
          trailSize={0.05}
          trailDensity={150}
          trailSpeedMin={300}
          trailSpeedMax={305}
          trailTailMin={120}
          trailTailMax={156}
          trailColor={[2.4, 2.4, 2.4]}
        />
      </section>
    </ReactLenis>
    // </main>
  );
}
