import React from 'react'
import {SignIn} from "@clerk/nextjs";

const Page = () => {
    return (
        <section className='flex justify-center items-center h-[calc(100vh-120px)]'>
            <SignIn />
        </section>
    )
}
export default Page
