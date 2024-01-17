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
                        rootBox: 'w-full',
                        card: 'rounded-md bg-[#F9F9F9] border shadow-none border-gray-200 w-full max-w-full',
                        navbar: 'border-r-0',
                        headerTitle: 'text-xl',
                        headerSubtitle: 'text-sm text-muted-foreground',
                        navbarButton: 'font-light',
                        membersPageInviteButton: 'disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2',
                        menuList__member: 'bg-[#F9F9F9] shadow-md h-[40px] p-0 rounded-md',
                        menuItem__member: 'rounded-md h-full',
                        selectOptionsContainer__role: 'bg-[#F9F9F9] shadow-md'
                    }
                }}
            />
        </section>
    )
}

export default OrganizationProfilePage;
