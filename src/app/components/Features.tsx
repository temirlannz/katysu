'use client';

import React, {useState} from 'react'
import Image from "next/image";
import featuresBg from '../../../public/features-bg.jpg';
import classes from '../../../public/classes.svg';
import groups from '../../../public/class.svg';
import students from '../../../public/group.svg';
import organization from '../../../public/organization.svg';

const featuresInfo = [
    {
        title: 'Create classes',
        description: 'Keep track of everyone&apos;s salaries and whether or not they&apos;ve been paid. Direct deposit not supported.',
        img: classes
    },
    {
        title: 'Groups',
        description: 'Keep track of everyone&apos;s salaries and whether or not they&apos;ve been paid. Direct deposit not supported.',
        img: groups
    },
    {
        title: 'Track attendance',
        description: 'Keep track of everyone&apos;s salaries and whether or not they&apos;ve been paid. Direct deposit not supported.',
        img: students
    },
    {
        title: 'Create organizations',
        description: 'Keep track of everyone&apos;s salaries and whether or not they&apos;ve been paid. Direct deposit not supported.',
        img: organization
    }
];

const Features = () => {
    const [img, setImage] = useState(classes);

    return (
        <section className='relative overflow-hidden bg-blue-600 pb-28 pt-20 sm:py-32'>
            <Image
                src={featuresBg}
                alt='features background'
                className='absolute left-1/2 top-1/2 max-w-none translate-x-[-44%] translate-y-[-42%]'
            />

            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative'>
                <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
                    <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
                        Everything you need to run your books.
                    </h2>
                    <p className="mt-6 text-lg tracking-tight text-blue-100">
                        Well everything you need if you aren&apos;t that picky about minor details like tax compliance.
                    </p>
                </div>

                <div className='mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0'>
                    <div className='-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5'>
                        <div className='relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal'>
                            {featuresInfo.map(feature => (
                                <button
                                    key={feature.title}
                                    onClick={() => setImage(feature.img)}
                                    className={img === feature.img
                                        ? 'text-left group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6 bg-white/10 lg:bg-white/10 lg:ring-1 lg:ring-inset lg:ring-white/10'
                                        : 'text-left group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6 hover:bg-white/10 lg:hover:bg-white/5'}
                                >
                                    <h3 className='text-white'>{feature.title}</h3>
                                    <p className="mt-2 hidden text-sm lg:block text-white">
                                        {feature.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className='lg:col-span-7'>
                        <div className='mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]'>
                            <Image src={img} alt='features img' className='w-full' />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Features
