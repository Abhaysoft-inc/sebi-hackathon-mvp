"use client"
import React from "react";
import Image from "next/image";
import { HeroFeature } from "@/components/HeroFeature";


export default function Home() {

  return (
    <>

      <div className="hero-section">

      </div>

      <div className="features-section">
        <HeroFeature title={'Content and updates from SEBI registered content creators and advisors'} desc={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nemo vero deleniti quaerat laudantium voluptas eligendi eaque commodi dolor, dolorum dignissimos totam distinctio iure autem quis fugiat at. Quasi, corrupti placeat. Nesciunt nemo qui, doloribus quam dolore quisquam deleniti alias quod, sequi totam beatae amet cumque veritatis vel iste culpa."} image={"/feed.png"} imageSide={"right"} />


        {/* <HeroFeature /> */}


      </div>

    </>
  );
}
