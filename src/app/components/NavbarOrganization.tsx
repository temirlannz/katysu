'use client';

import React, {FC} from 'react'
import Link from "next/link";
import {UserPlus} from "lucide-react";
import {twMerge} from "tailwind-merge";
import {usePathname} from "next/navigation";
import {OrganizationSwitcher, UserButton} from "@clerk/nextjs";

const NavbarOrganization = () => {
    const pathname = usePathname();

    return (
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <nav className='flex justify-between'>
                <div className='flex items-center justify-between md:gap-x-12'>
                    <Link href='/organizations' className='flex items-center gap-2 text-sm font-medium'>
                        <UserPlus />
                        Katysu
                    </Link>

                    <div className="hidden md:flex md:gap-x-6">
                        <Link href='/organizations'
                              className={
                                twMerge(`text-sm hover:text-black transition`,
                                `${
                                    pathname === '/organization-profile' || 
                                    pathname === '/organization-profile/organization-settings' ||
                                    pathname === '/organizations'    
                                        ? 'text-black' 
                                        : 'text-muted-foreground'
                                }`)}
                        >
                            Organizations
                        </Link>

                        <Link href='/create-organization'
                              className={
                                  twMerge(`text-sm hover:text-black transition text-muted-foreground`,
                                      `${pathname === '/create-organization' ? 'text-black' : 'text-muted-foreground'}`)}
                        >
                            Create
                        </Link>
                    </div>
                </div>

                <div className='flex items-center gap-x-5 md:gap-x-8'>
                    <OrganizationSwitcher
                        afterLeaveOrganizationUrl='/organizations'
                        appearance={{
                            elements: {
                                organizationSwitcherPopoverCard: 'rounded-md bg-[#F9F9F9] shadow-md',
                                organizationSwitcherPopoverActions: 'bg-neutral-100',
                                rootBox: 'relative w-[215px] h-full',
                                organizationSwitcherTrigger: 'absolute w-full h-full left-0 top-0'
                            }
                        }}
                    />

                    <UserButton
                        afterSignOutUrl='/'
                        appearance={{
                            elements: {
                                userButtonPopoverCard: 'rounded-md bg-[#F9F9F9] py-4 shadow-md',
                                avatarBox: 'w-[40px] h-[40px]',
                                userPreview: 'px-5',
                                userButtonPopoverActionButton: 'px-5 py-3',
                                userButtonPopoverActionButtonText: 'text-muted-foreground',
                                userButtonPopoverActionButtonIcon: 'text-muted-foreground'
                            }
                        }}
                    />
                </div>
            </nav>
        </div>
    )
}
export default NavbarOrganization
