import StackingCard from'@/components/CardsStack/StackingCard';
import { ReactLenis } from'lenis/react'

export default function Page() {
 return (
 <>
 <ReactLenis root>
 <StackingCard data={categoriesData} />
  </ReactLenis>
 </>
 );
}

const categoriesData = [
 {
 id:"01",
 category:"Events",
 title:"Global Events, Brand Activations, Experience Content",
 backgroundColor:"bg-[#F7FFDC]",
 description:
"From corporate summits to viral moments, we create experiences that fuel alignment and connection between audiences and business goals.",
 image:"/assets/img/image01.webp",
 },
 {
 id:"02",
 category:"Exhibits",
 backgroundColor:"bg-[#D1F3F5]",
 title:"Digital Campaigns, Social Media, Influencer Marketing",
 description:
"We craft compelling digital narratives that resonate across platforms, building authentic connections between brands and their communities.",
 image:"/assets/img/image02.webp",
 },
 {
 id:"03",
 category:"Congresses",
 backgroundColor:"bg-[#DDD9FF]",
 title:"Product Launches, Experiential Retail, Pop-Up Experiences",
 description:
"Transform product introductions into memorable moments that generate buzz and drive consumer engagement through innovative retail experiences.",
 image:"/assets/img/image03.webp",
 },
 {
 id:"04",
 category:"Sports",
 backgroundColor:"bg-[#FFDDCA]",
 title:"Conferences, Trade Shows, B2B Engagement",
 description:
"Elevate your presence at industry events with immersive booth experiences and strategic activations that convert connections into opportunities.",
 image:"/assets/img/image01.webp",
 },
];
