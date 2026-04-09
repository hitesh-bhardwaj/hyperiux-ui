// import ParallaxCard from "@/components/ParallaxCard";
"use client"
import ParallaxCard from "@/components/Ametrasu/ParallaxCard";


export default function Page() {
  return (
    <div  className="w-screen h-screen bg-white">
      <ParallaxCard
        colorMap="/textures/character.ktx2"
        depthMap="/textures/character_depth.ktx2"
        normalMap="/textures/character_normal.ktx2"
        scanMap="/textures/character_scan.ktx2"
        width={4}
        height={4}
        parallaxStrength={0.05}
        parallaxLayers={[0, 0.04, 0.09, 0.16]}
      />
    </div>
  );
}