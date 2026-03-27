'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import SplitText from 'gsap/dist/SplitText';
import ScrambleTextPlugin from 'gsap/dist/ScrambleTextPlugin';

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

const ScrambleText = ({ 
  text, 
  speed = 0.6, 
  charType = 'lowercase', 
  textSize = 'text-base',
  textColor = 'text-white', // 👈 NEW PROP
  className 
}) => {
  const elRef = useRef(null);
  const splitRef = useRef(null);
  const tlRef = useRef(null);

  const [chars, setChars] = useState([]);
  const [isActive, setIsActive] = useState(false);

  // Split after fonts are ready and whenever text changes
  useEffect(() => {
    let isCancelled = false;

    const setup = async () => {
      try {
        if (document?.fonts?.ready) {
          await document.fonts.ready;
        } else {
          await new Promise(r => requestAnimationFrame(() => r(null)));
        }
      } catch {}

      if (isCancelled || !elRef.current) return;

      // Cleanup old instances
      tlRef.current?.kill();
      splitRef.current?.revert();
      splitRef.current = null;

      const ctx = gsap.context(() => {
        const split = new SplitText(elRef.current, { type: 'chars' });
        splitRef.current = split;

        elRef.current.removeAttribute('aria-label');

        split.chars.forEach(char => {
          char.removeAttribute('aria-label');
        });

        gsap.set(split.chars, { opacity: 0.7 });
        setChars(split.chars);
      }, elRef);

      return () => ctx.revert();
    };

    const clean = setup();

    return () => {
      (async () => { await clean; })();
      tlRef.current?.kill();
      splitRef.current?.revert();
    };
  }, [text]);

  const handleMouseEnter = useCallback(() => {
    if (isActive || !chars.length) return;

    setIsActive(true);

    const originals = chars.map(c => c.textContent || '');
    const tl = gsap.timeline({
      onComplete: () => setIsActive(false),
      defaults: { ease: 'none' },
    });
    tlRef.current?.kill();
    tlRef.current = tl;

    tl.to(chars, {
      opacity: 0.4,
      duration: 0.4,
      stagger: 0.02,
      ease: 'power1.out',
    }, 0);

    tl.to(chars, {
      duration: 0.6,
      scrambleText: {
        text: (i) => originals[i],
        chars: charType || 'lowercase',
        speed,
        revealDelay: 0.5,
      },
      stagger: 0.05,
    }, 0);

    const totalStagger = (chars.length - 1) * 0.05;

    tl.to(chars, {
      opacity: 1,
      duration: 0.4,
      stagger: 0.02,
      ease: 'power1.out',
    }, 0.2 + totalStagger);

    tl.to(chars, {
      opacity: 0.7,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power1.out',
    }, '>-0.2');
  }, [isActive, chars, charType, speed]);

  return (
    <div 
      onMouseEnter={handleMouseEnter} 
      onFocus={handleMouseEnter} 
      tabIndex={0}
    >
      <p
        ref={elRef}
        className={`${textSize} ${textColor} w-full cursor-pointer ${className ?? ''}`} // 👈 UPDATED
      >
        {text}
      </p>
    </div>
  );
};

export default ScrambleText;