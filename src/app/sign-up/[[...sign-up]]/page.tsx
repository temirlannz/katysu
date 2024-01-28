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
                            card: 'rounded-md px-4 bg-[#F9F9F9] shadow-none sm:bg-white sm:shadow-md sm:px-8',
                            formButtonPrimary: 'bg-primary hover:bg-primary/90',
                            headerTitle: 'text-base sm:text-[20px]',
                            headerSubtitle: 'text-sm sm:text-base'
                        }
                    }}
                    afterSignUpUrl='/home'
                />
            </ClerkLoaded>
        </section>
    )
}
export default Page
