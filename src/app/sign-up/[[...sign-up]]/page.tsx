import React from 'react'
import {ClerkLoaded, ClerkLoading, SignUp} from "@clerk/nextjs";
import LoadingAuth from "@/app/components/LoadingAuth";

const Page = () => {
    return (
        <section className='flex justify-center items-center h-[calc(100vh-120px)]'>
            <ClerkLoading>
                <LoadingAuth />
            </ClerkLoading>
            <ClerkLoaded>
                <SignUp
                    appearance={{
                        elements: {
                            card: 'rounded-md shadow-md',
                            formButtonPrimary: 'bg-primary hover:bg-primary/90'
                        }
                    }}
                    afterSignUpUrl='/home'
                />
            </ClerkLoaded>
        </section>
    )
}
export default Page
