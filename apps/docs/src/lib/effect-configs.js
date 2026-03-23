// Configuration for effect showcases
// Defines the props, defaults, and demo content for each effect

export const effectConfigs = {
  "blur-text": {
    props: [
      { name: "blur", type: "range", min: 0, max: 20, step: 1, description: "Initial blur amount in pixels" },
      { name: "duration", type: "range", min: 0.1, max: 2, step: 0.1, description: "Animation duration in seconds" },
      { name: "delay", type: "range", min: 0, max: 1, step: 0.1, description: "Delay before animation starts" },
    ],
    defaults: {
      blur: 10,
      duration: 0.5,
      delay: 0,
    },
    demoText: "Blur Text Effect",
    demoClassName: "text-4xl font-bold text-white",
  },

  "aurora-background": {
    props: [
      { name: "blur", type: "range", min: 50, max: 200, step: 10, description: "Blur amount for the gradient" },
      { name: "speed", type: "range", min: 0.1, max: 2, step: 0.1, description: "Animation speed multiplier" },
    ],
    defaults: {
      blur: 100,
      speed: 0.5,
    },
    demoClassName: "w-full h-[300px]",
    demoContent: "Aurora Background",
  },

  "magnetic-button": {
    props: [
      { name: "strength", type: "range", min: 0.1, max: 1, step: 0.1, description: "Magnetic pull strength" },
      { name: "radius", type: "range", min: 50, max: 300, step: 10, description: "Activation radius in pixels" },
    ],
    defaults: {
      strength: 0.5,
      radius: 150,
    },
    demoText: "Hover Me",
    demoClassName: "px-6 py-3 bg-white text-black rounded-lg font-medium",
  },

  "shimmer-button": {
    props: [
      { name: "duration", type: "range", min: 0.5, max: 3, step: 0.1, description: "Shimmer animation duration" },
      { name: "shimmerColor", type: "color", description: "Color of the shimmer effect" },
    ],
    defaults: {
      duration: 1.5,
      shimmerColor: "rgba(255, 255, 255, 0.4)",
    },
    demoText: "Shimmer Button",
    demoClassName: "px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium",
  },

  "smooth-scroll": {
    props: [],
    defaults: {},
    isContainer: true,
    note: "Wrap your entire page content with SmoothScroll for momentum-based scrolling.",
  },

  "text-reveal": {
    props: [
      { name: "duration", type: "range", min: 0.5, max: 2, step: 0.1, description: "Animation duration" },
      { name: "stagger", type: "range", min: 0.05, max: 0.3, step: 0.01, description: "Delay between each word" },
      { name: "y", type: "range", min: 20, max: 150, step: 10, description: "Initial Y offset in pixels" },
    ],
    defaults: {
      duration: 1,
      stagger: 0.1,
      y: 100,
    },
    demoText: "Scroll to reveal this text animation",
    demoClassName: "text-3xl font-bold text-white",
  },
};

export function getEffectConfig(slug) {
  return effectConfigs[slug] || null;
}
