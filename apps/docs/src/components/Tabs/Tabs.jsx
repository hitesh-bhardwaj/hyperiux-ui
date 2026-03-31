"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./Tabs.css";

const Tabs = ({
  tabs = [],
  defaultActiveIndex = 0,
  className = "",
}) => {
  const safeDefaultIndex =
    tabs.length > 0
      ? Math.min(Math.max(defaultActiveIndex, 0), tabs.length - 1)
      : 0;

  const [activeTab, setActiveTab] = useState(safeDefaultIndex);
  const labelRefs = useRef([]);
  const contentRefs = useRef([]);
  const activeLineRef = useRef(null);

  const moveActiveLine = (index) => {
    const activeLabel = labelRefs.current[index];
    const activeLine = activeLineRef.current;

    if (!activeLabel || !activeLine) return;

    gsap.to(activeLine, {
      x: activeLabel.offsetLeft,
      width: activeLabel.offsetWidth,
      duration: 0.45,
      ease: "power3.out",
    });
  };

  const animateContent = (currentIndex, nextIndex) => {
    const currentContent = contentRefs.current[currentIndex];
    const nextContent = contentRefs.current[nextIndex];

    if (!currentContent || !nextContent || currentIndex === nextIndex) return;

    gsap.to(currentContent, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        gsap.set(currentContent, {
          display: "none",
          pointerEvents: "none",
        });

        gsap.set(nextContent, {
          display: "block",
          pointerEvents: "auto",
          opacity: 0,
        });

        gsap.to(nextContent, {
          opacity: 1,
          duration: 0.35,
        });
      },
    });
  };

  const handleTabClick = (index) => {
    if (index === activeTab) return;

    animateContent(activeTab, index);
    moveActiveLine(index);
    setActiveTab(index);
  };

  useLayoutEffect(() => {
    if (!tabs.length) return;

    const activeLabel = labelRefs.current[safeDefaultIndex];
    const activeLine = activeLineRef.current;

    if (activeLabel && activeLine) {
      gsap.set(activeLine, {
        x: activeLabel.offsetLeft,
        width: activeLabel.offsetWidth,
      });
    }

    contentRefs.current.forEach((content, index) => {
      if (!content) return;

      gsap.set(content, {
        display: index === safeDefaultIndex ? "block" : "none",
        opacity: index === safeDefaultIndex ? 1 : 0,
        pointerEvents: index === safeDefaultIndex ? "auto" : "none",
      });
    });
  }, [tabs, safeDefaultIndex]);

  if (!tabs.length) return null;

  return (
    <div className={`tabs ${className}`}>
      {/* Labels */}
      <div className="tabs__header">
        <div className="tabs__labels">
          {tabs.map((tab, index) => (
            <button
              key={tab.id || index}
              ref={(el) => (labelRefs.current[index] = el)}
              onClick={() => handleTabClick(index)}
              className={`tabs__label ${
                activeTab === index
                  ? "tabs__label--active"
                  : "tabs__label--inactive"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div ref={activeLineRef} className="tabs__active-line" />
      </div>

      {/* Content */}
      <div className="tabs__content">
        {tabs.map((tab, index) => (
          <div
            key={tab.id || index}
            ref={(el) => (contentRefs.current[index] = el)}
            className="tabs__panel"
            style={{
              display: index === safeDefaultIndex ? "block" : "none",
              opacity: index === safeDefaultIndex ? 1 : 0,
            }}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;