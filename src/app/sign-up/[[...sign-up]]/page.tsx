import React from 'react'
import {SignUp} from "@clerk/nextjs";

const Page = () => {
    return (
        <section className='flex justify-center items-center h-[calc(100vh-120px)]'>
            <SignUp />
        </section>
    )
}
export default Page
