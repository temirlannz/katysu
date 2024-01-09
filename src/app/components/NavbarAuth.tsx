import React from 'react'
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {UserPlus} from "lucide-react";
import {auth, SignIn} from "@clerk/nextjs";
import NavbarOrganization from "@/app/components/NavbarOrganization";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import NavbarMember from "@/app/components/NavbarMember";

const NavbarAuth = () => {

    return (
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <nav className='flex justify-between'>
                <div className='flex items-center justify-between md:gap-x-12'>
                    <Link href='/' className='flex items-center gap-2'>
                        <UserPlus />
                        Katysu
                    </Link>
                </div>

                <div className='flex gap-x-6 items-center'>
                    <Link href='/sign-up' className='text-sm text-slate-500 hover:text-black transition'>
                        Sign-up
                    </Link>
                </div>
            </nav>
        </div>
    )
}
export default NavbarAuth
