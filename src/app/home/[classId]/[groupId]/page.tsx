import React, {Suspense} from 'react'
import {getXataClient} from "@/xata";
import {DataTable} from "@/app/home/[classId]/[groupId]/data-table";
import {columns} from "@/app/home/[classId]/[groupId]/columns";
import NewStudent from "@/app/home/[classId]/[groupId]/new-student";
import Loading from "@/app/home/[classId]/[groupId]/loading";

const xata = getXataClient();

const getGroup = async (groupId: string) => {
    const group = await xata.db.student.filter({ group: groupId }).getMany();
    const groupName = await xata.db.group.filter({ id: groupId }).select(['name']).getFirst();
    return { group, groupName };
}

const Group = async ({ params }: { params: {groupId: string, classId: string} }) => {
    const groupData = await getGroup(params.groupId);

    return (
        <section className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center mt-5 mb-5'>
                <h1 className='text-xl font-medium'>
                    { groupData?.groupName?.name }
                </h1>

                <NewStudent />
            </div>
            
            <Suspense fallback={<Loading />}>
                <DataTable columns={columns} data={JSON.parse(JSON.stringify(groupData.group))} />
            </Suspense>
        </section>
    )
}
export default Group
