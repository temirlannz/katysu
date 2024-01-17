import React from 'react'
import {Skeleton} from "@/components/ui/skeleton";

const LoadingAuth = () => {
    return (
        <div className='h-[458px] w-[400px] pt-9 px-8 pb-12 flex flex-col gap-8 bg-white rounded-md shadow-md'>
            <div className='flex flex-col gap-1'>
                <Skeleton className='w-1/2 h-[30px]' />
                <Skeleton className='w-2/3 h-[20px]' />
            </div>

            <div className='flex flex-col gap-8'>
                <Skeleton className='w-full h-[42px]' />
                <Skeleton className='w-full h-[17px]' />
                <div>
                    <Skeleton className='w-full h-[17px]' />
                    <Skeleton className='w-full h-[38px] mt-2' />
                    <Skeleton className='w-full h-[36px] mt-4' />
                </div>
            </div>

            <Skeleton className='w-full h-[16px]' />
        </div>
    )
}
export default LoadingAuth
