import React from 'react'
import {Skeleton} from "@/components/ui/skeleton";

const LoadingSkeleton = () => {
    return (
        <div>
            <Skeleton className='w-[200px] sm:w-[384px] h-[36px] mb-2' />

            <div className='flex flex-col gap-y-1'>
                <Skeleton className='w-full h-[40px]' />
                <Skeleton className='w-full h-[48px]' />
                <Skeleton className='w-full h-[48px]' />
                <Skeleton className='w-full h-[48px]' />
                <Skeleton className='w-full h-[48px]' />
            </div>

            <div className='flex justify-end items-center space-x-2 py-4'>
                <Skeleton className='w-[80px] h-[36px]' />
                <Skeleton className='w-[80px] h-[36px]' />
            </div>
        </div>
    )
}
export default LoadingSkeleton
