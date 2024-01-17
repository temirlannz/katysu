import React from 'react'
import {Skeleton} from "@/components/ui/skeleton";

const LoadingSkeleton = () => {
    return (
        <div className='w-full h-[450px] rounded-md bg-white flex'>
            <div className='px-[1.5rem] py-[2.375rem]'>
                <Skeleton className='h-[32px] w-[184px] mb-3'/>
                <Skeleton className='h-[32px] w-[184px] mb-1'/>
                <Skeleton className='h-[32px] w-[184px]'/>
            </div>

            <div className='px-[2rem] py-[2.375rem] w-full flex flex-col gap-[2rem]'>
                <div>
                    <Skeleton className='h-[32px] w-[120px] mb-3' />
                    <Skeleton className='h-[20px] w-[248px]' />
                </div>

                <div className='flex gap-2'>
                    <Skeleton className='h-[32px] w-[120px]' />
                    <Skeleton className='h-[32px] w-[120px]' />
                </div>

                <div className='space-y-3'>
                    <Skeleton className='h-[55px] w-full' />
                    <Skeleton className='h-[55px] w-full' />
                    <Skeleton className='h-[55px] w-full' />

                    <div className='flex justify-between items-center'>
                        <Skeleton className='h-[20px] w-[150px]' />
                        <Skeleton className='h-[20px] w-[150px]' />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default LoadingSkeleton
