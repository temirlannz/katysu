import React from 'react'
import Link from "next/link";
import {UserPlus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {UserButton, UserProfile} from "@clerk/nextjs";

const NavbarMember = () => {
    return (
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <nav className='flex justify-between'>
                <div className='flex items-center justify-between md:gap-x-12'>
                    <Link href='/home' className='flex items-center gap-2'>
                        <UserPlus />
                        Katysu
                    </Link>

                    <div className="hidden md:flex md:gap-x-6">
                        <Link href='/home' className='text-sm text-muted-foreground hover:text-black transition'>
                            Home
                        </Link>
                    </div>
                </div>

                <div className='flex gap-x-6 items-center'>
                    <UserButton
                        appearance={{
                            elements: {
                                rootBox: 'rounded-md',
                                headerTitle: 'text-xl',
                                userButtonPopoverCard: 'rounded-md bg-[#F9F9F9] py-4 shadow-md',
                                avatarBox: 'w-[40px] h-[40px]',
                                userPreview: 'px-5',
                                userButtonPopoverActionButton: 'px-5 py-3',
                                userButtonPopoverActionButtonText: 'text-muted-foreground',
                                userButtonPopoverActionButtonIcon: 'text-muted-foreground',
                            }
                        }}
                        afterSignOutUrl='/'
                    />
                </div>
            </nav>
        </div>
    )
}
export default NavbarMember
