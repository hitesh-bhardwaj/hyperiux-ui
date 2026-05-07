import InfiniteGridTunnel from'@/components/GridTunnel/GridTunnel';
import React from'react'

const images = [
"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1521119989659-a83eee488004?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1552058544-f2b08422138a?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1528892952291-009c663ce843?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1492447166138-50c3889fccb1?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1517849845537-4d257902454a?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1504593811423-6dd665756598?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1520409364224-63400afe26e5?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=900&auto=format&fit=crop",
"https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=900&auto=format&fit=crop",
];

const page = () => {
 return (
 <>
 <InfiniteGridTunnel images={images}/>
 </>
 )
}

export default page