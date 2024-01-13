import React from 'react'
import {DataTable} from "@/app/home/[classId]/data-table";
import {getXataClient} from "@/xata";
import {columns} from "@/app/home/[classId]/columns";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import NewGroup from "@/app/home/[classId]/new-group";

const xata = getXataClient();

const getData = async (classId: string) => {
    const data = await xata.db.group.filter({ 'classes.id': classId }).getMany();

    return data;
}

const Class = async ({ params }: { params: {classId: string} }) => {
    const groups = await getData(params.classId);

    return (
        <section className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center mt-5 mb-5'>
                <h1 className='text-xl font-medium'>Groups</h1>

                <NewGroup />
            </div>

            <DataTable columns={columns} data={groups} />
        </section>
    )
}
export default Class
