import React from 'react'
import {ClerkLoaded, ClerkLoading, SignIn} from "@clerk/nextjs";
import LoadingAuth from "@/app/components/LoadingAuth";

const Page = () => {
    return (
        <section className='flex justify-center items-center h-[calc(100vh-76px)] sm:h-[calc(100vh-116px)]'>
            <ClerkLoading>
                <LoadingAuth />
            </ClerkLoading>
            <ClerkLoaded>
                <SignIn
                    appearance={{
                        elements: {
                            card: 'rounded-md px-4 bg-[#F9F9F9] shadow-none sm:bg-white sm:shadow-md sm:px-8',
                            formButtonPrimary: 'bg-primary hover:bg-primary/90',
                            headerTitle: 'text-base sm:text-[20px]',
                            headerSubtitle: 'text-sm sm:text-base'
                        }
                    }}
                    signUpUrl='/sign-up'
                    afterSignInUrl='/organization'
                />
            </ClerkLoaded>
        </section>
    )
}
export default Page
