'use client';

import React from 'react'
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {UserPlus} from "lucide-react";
import {auth, useAuth} from "@clerk/nextjs";
import NavbarOrganization from "@/app/components/NavbarOrganization";
import NavbarMember from "@/app/components/NavbarMember";
import NavbarAuth from "@/app/components/NavbarAuth";
import {usePathname} from "next/navigation";

const Navbar = () => {
    const { userId, orgRole } = useAuth();
    const pathname = usePathname();

    if (pathname === '/sign-in' ||
        pathname === '/sign-up' ||
        pathname === '/sign-in/factor-one') {
        return <NavbarAuth />
    }

    if (userId && orgRole === 'org:member') {
        return <NavbarMember />
    }

    if (userId) {
        return <NavbarOrganization />
    }

    return (
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <nav className='flex justify-between h-[36px]'>
                <div className='flex items-center justify-between md:gap-x-12'>
                    <Link href='/' className='flex items-center gap-2'>
                        <UserPlus />
                        Katysu
                    </Link>

                    {/*<div className="hidden md:flex md:gap-x-6">*/}
                    {/*    <Link href='/features' className='text-sm text-slate-500 hover:text-black transition'>*/}
                    {/*        Features*/}
                    {/*    </Link>*/}

                    {/*    <Link href='/testimonials' className='text-sm text-slate-500 hover:text-black transition'>*/}
                    {/*        Testimonials*/}
                    {/*    </Link>*/}

                    {/*    <Link href='/pricing' className='text-sm text-slate-500 hover:text-black transition'>*/}
                    {/*        Pricing*/}
                    {/*    </Link>*/}
                    {/*</div>*/}
                </div>

                <div className='flex gap-x-3 sm:gap-x-6 items-center'>
                    <Link href='/sign-in' className='text-sm text-slate-500 hover:text-black transition'>
                        Sign-in
                    </Link>
                    <Button>
                        <Link href='/sign-in'>Get started</Link>
                    </Button>
                </div>
            </nav>
        </div>
    )
}
export default Navbar
