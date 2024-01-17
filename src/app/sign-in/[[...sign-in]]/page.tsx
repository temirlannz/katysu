import React from 'react'
import {ClerkLoaded, ClerkLoading, SignIn} from "@clerk/nextjs";
import LoadingAuth from "@/app/components/LoadingAuth";

const Page = () => {
    return (
        <section className='flex justify-center items-center h-[calc(100vh-120px)]'>
            <ClerkLoading>
                <LoadingAuth />
            </ClerkLoading>
            <ClerkLoaded>
                <SignIn
                    appearance={{
                        elements: {
                            card: 'rounded-md shadow-md',
                            formButtonPrimary: 'bg-primary hover:bg-primary/90'
                        }
                    }}
                    signUpUrl='/sign-up'
                />
            </ClerkLoaded>
        </section>
    )
}
export default Page
