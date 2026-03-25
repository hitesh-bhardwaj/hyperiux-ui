import Card from "@/components/Card/Card";
import React from "react";

const page = () => {
  return (
    <section className="w-screen h-screen text-black flex justify-between items-center px-[5vw]">
      <Card
        title="Luxury Residences"
        subtitle="Dubai Marina"
        content="Experience premium waterfront living with unmatched skyline views."
        footer={<button>Explore</button>}
      />
      <Card>
        <h2 className="text-[2vw]">Custom Layout</h2>
        <p>Anything you want inside</p>
        <button>CTA</button>
      </Card>
      <Card>
        <h2 className="text-[2vw]">Custom Layout</h2>
        <p>Anything you want inside</p>
        <button>CTA</button>
      </Card>
    </section>
  );
};

export default page;
