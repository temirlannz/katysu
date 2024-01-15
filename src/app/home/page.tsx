import React, {Suspense} from 'react'
import {getXataClient} from "@/xata";
import {DataTable} from "@/app/home/data-table";
import {columns} from "@/app/home/columns";
import {auth} from "@clerk/nextjs";
import NewClass from "@/app/home/new-class";
import Loading from "@/app/home/loading";

const xata = getXataClient();

async function getData() {
    const { userId } = auth();

    return await xata.db.classes.filter({ 'memberId': `${userId}` }).getMany();
}

const Home = async () => {
    const data = await getData();

    return (
        <section className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center mt-5 mb-5'>
                <h1 className='text-xl font-medium'>Classes</h1>

                <NewClass />
            </div>

            <Suspense fallback={<Loading />}>
                <DataTable columns={columns} data={data} />
            </Suspense>
        </section>
    )
}
export default Home
