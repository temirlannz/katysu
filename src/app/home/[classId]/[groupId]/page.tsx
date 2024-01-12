import React from 'react'
import {getXataClient} from "@/xata";
import {DataTable} from "@/app/home/[classId]/[groupId]/data-table";
import {columns} from "@/app/home/[classId]/[groupId]/columns";
import NewStudent from "@/app/home/[classId]/[groupId]/new-student";

const xata = getXataClient();

const getGroup = async (groupId: string) => {
    return await xata.db.student.filter({ 'group.id': groupId }).getMany();
}

const Group = async ({ params }: { params: {groupId: string, classId: string} }) => {
    const group = await getGroup(params.groupId);

    return (
        <section className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center mt-5 mb-5'>
                <h1 className='text-xl font-medium'>Students</h1>

                <NewStudent />
            </div>
            
            <DataTable columns={columns} data={group} />
        </section>
    )
}
export default Group
