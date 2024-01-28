import Hero from "@/app/components/Hero";
import React from "react";
import Features from "@/app/components/Features";
import {redirect} from "next/navigation";
import {auth} from "@clerk/nextjs";

export default async function Home() {

    return (
        <>
            <Hero />
            {/*<Features />*/}

            <div className='absolute -z-10 w-full h-full top-0 left-0 overflow-hidden bg-white'>
                <video
                    src='https://res.cloudinary.com/danbfmgav/video/upload/v1706468465/h6ixbs6lbv9arme3botu.mp4'
                    autoPlay
                    loop
                    muted
                    className='absolute -z-10 mix-blend-difference w-full h-full object-cover blur-2xl'
                >
                </video>
            </div>
        </>
    )
}
