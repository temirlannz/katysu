import React from 'react'
import {Button} from "@/components/ui/button";

const Hero = () => {
    return (
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 text-center lg:pt-32 pb-24 h-[calc(100vh-76px)] sm:h-[calc(100vh-116px)] flex flex-col sm:items-center justify-center'>
            <h1 className='sm:mx-auto max-w-4xl font-display text-5xl tracking-tight text-slate-900 sm:text-9xl font-extrabold text-left sm:text-center'>
                ATTENDANCE <br/> CHECKER
            </h1>

            <p className="sm:mx-auto mt-2 sm:mt-6 max-w-4xl text-sm sm:text-lg tracking-tight text-slate-700 text-left">
                An application for attendance tracking, no papers are needed now and the data is securely stored.
            </p>

            {/*<div className="mt-10 flex justify-center gap-x-6">*/}
            {/*    <Button>Get 6 month free</Button>*/}
            {/*</div>*/}
        </div>
    )
}
export default Hero
