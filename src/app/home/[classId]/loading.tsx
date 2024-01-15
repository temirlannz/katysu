import React from 'react'
import LoadingSkeleton from "@/app/components/LoadingSkeleton";
import {Skeleton} from "@/components/ui/skeleton";

const Loading = () => {
    return (
        <section className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center mt-5 mb-5'>
                <h1 className='text-xl font-medium'>Groups</h1>

                <div>
                    <Skeleton className='w-[120px] h-[36px]' />
                </div>
            </div>

            <LoadingSkeleton />
        </section>
    )
}
export default Loading
