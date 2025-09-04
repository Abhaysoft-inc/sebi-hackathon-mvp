import React from 'react'
import Image from "next/image";

interface HeroFeatureProps {
    title: string;
    desc: string;
    image: string;
    imageSide: 'left' | 'right';
}

export const HeroFeature = ({ title, desc, image, imageSide }: HeroFeatureProps) => {
    return (
        <div className="feature flex justify-between mx-24 py-16 items-center">

            <div className="text w-[50%]">
                <p className="text-3xl">{title}</p>
                <p className="text-md mt-10">{desc}</p>

            </div>
            <Image src={`${image}`} alt="feed-section" width={286} height={286} className="w-64" />
            {/* <img src="/feed.png" alt="feed-section" className="w-64" /> */}

        </div>
    )
}
