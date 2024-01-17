import React from 'react'
import {auth} from "@clerk/nextjs";
import {Card, CardContent} from "@/components/ui/card";
import {Building} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {redirect} from "next/navigation";

const Organization = async () => {
    const {  userId, orgId, orgRole } = auth();

    return (
        <section className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <h1 className='text-xl font-medium mt-5'>My organizations</h1>

            {
                orgId
                    ? redirect('/organization-profile')
                    : (
                        <div className='flex mt-4 sm:mt-0 sm:justify-center sm:items-center sm:h-[calc(100vh-160px)]'>
                            <Card className='w-full md:w-[350px] flex flex-col items-center justify-center p-3'>
                                <Building size={24} className='mb-3' />

                                <p className='text-sm mb-5'>
                                    No organizations yet.
                                </p>

                                <CardContent>
                                    <Link href='/create-organization'>
                                        <Button variant='secondary' className='text-sm font-medium'>
                                            Create one
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    )
            }
        </section>
    )
}
export default Organization
