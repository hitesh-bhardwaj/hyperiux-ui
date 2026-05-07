"use client";

import DirectionalMegaMenu from"@/components/Menu/DirectionalMegaMenu";
import Menu1 from"@/components/Menu/Menu1";
import Menu2 from"@/components/Menu/Menu2";
import Menu3 from"@/components/Menu/Menu3";

// import DirectionalMegaMenu from"./DirectionalMegaMenu";

const menuItems = [
 {
 label:"Products",
 customContent: <Menu1 />,
 },
 {
 label:"Solutions",
 customContent: <Menu2 />,
 },
 {
 label:"Developers",
 customContent: <Menu3 />,
 },
 {
 label:"About",
 },
];

export default function DemoPage() {
 return (
 <div className="px-8 py-10 flex justify-between h-screen bg-black">
 <DirectionalMegaMenu
 items={menuItems}
 closeDelay={80}
 contentWrapperClassName="p-8"
 animation={{
 duration: 0.35,
 ease:"power2.inOut",
 distance: 100,
 closeOpacityDuration:0.3,
 openOpacityDuration:0.3,
 fade: true,
 heightDuration: 0.35,
 heightEase:"power2.inOut",
 }}
 />
   </div>
 );
}
