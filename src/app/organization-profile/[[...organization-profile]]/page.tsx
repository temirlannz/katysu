import React from "react";
import {auth, OrganizationProfile} from "@clerk/nextjs";
import {redirect} from "next/navigation";

const OrganizationProfilePage = () => {

    const { orgId } = auth();

    if (!orgId) {
        redirect('/organizations');
    }

    return (
        <section className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            {/*<h1 className='text-xl font-medium mt-5'>My organizations</h1>*/}

            <OrganizationProfile
                path="/organization-profile"
                routing="path"
                appearance={{
                    elements: {
                        card: 'rounded-md bg-[#F9F9F9] border shadow-none border-gray-200',
                        navbar: 'border-r-0',
                        headerTitle: 'text-xl',
                        headerSubtitle: 'text-sm text-muted-foreground',
                        navbarButton: 'font-light'
                    }
                }}
            />
        </section>
    )
}

export default OrganizationProfilePage;
