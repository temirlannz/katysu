import React from 'react'
import {SignUp} from "@clerk/nextjs";

const Page = () => {
    return (
        <section className='flex justify-center items-center h-[calc(100vh-120px)]'>
            <SignUp
                appearance={{
                    elements: {
                        card: 'rounded-md shadow-md',
                        formButtonPrimary: 'bg-primary hover:bg-primary/90'
                    }
                }}
            />
        </section>
    )
}
export default Page
