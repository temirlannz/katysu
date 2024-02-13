import React from 'react'
import {WavyBackground} from "@/components/ui/wavy-background";

const Hero = () => {
    return (
        <WavyBackground backgroundFill='white' colors={['red', 'blue', 'yellow']} blur={15}>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 text-center lg:pt-32 pb-24 h-[calc(100vh-76px)] sm:h-[calc(100vh-116px)] flex flex-col sm:items-center justify-center'>
                <h1 className='sm:mx-auto max-w-4xl font-display text-5xl tracking-tight sm:text-8xl font-extrabold text-left sm:text-center'>
                    ATTENDANCE <br/> CHECKER
                </h1>

                <p className="sm:mx-auto mt-2 sm:mt-6 max-w-4xl text-sm sm:text-lg tracking-tight text-left sm:text-center">
                    An application for attendance tracking, no papers are needed now <br/> and the data is securely stored.
                </p>
            </div>
        </WavyBackground>
    )
}
export default Hero
