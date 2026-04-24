import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';


const VideoUI = ({ isZoomed, setIsZoomed, progress }) => {
    const progressRef = useRef();
    const progressVal = useRef(progress);

    // GSAP animate the progress bar width smoothly
    // useEffect(() => {
    //     if (!progressRef.current) return;
    //     if (typeof progress !== "number") return;
    //     // Save most recent value for gsap overwrite
    //     progressVal.current = progress;
    //     gsap.to(progressRef.current, {
    //         width: `${progress * 100}%`,
    //         overwrite: 'auto'
    //     });
    // }, [progress]);

    return (
        <div className={`absolute bottom-0 left-0 w-full p-8 flex justify-between items-center text-white/50 text-xs font-mono transition-opacity duration-1000 ${isZoomed ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            {/* Left */}
            <div className="flex items-center gap-2">
                <span className="uppercase">HYPERIUX IMMERSION LABS</span>
            </div>

            {/* Center */}
            <button 
                onClick={() => setIsZoomed(false)}
                className="hover:text-white transition-colors cursor-pointer "
            >
                GO BACK
            </button>

            {/* Progress Bar (Bottom Line) */}
            <div className="absolute bottom-0 left-0 h-[5px] bg-orange-500/20 w-full">
                <div
                    ref={progressRef}
                    className="h-full bg-orange-500"
                    style={{ width: `${progress * 100}%`, transition: "none" }} // no css transition: gsap handles animation
                />
            </div>
        </div>
    );
};

export default VideoUI;
