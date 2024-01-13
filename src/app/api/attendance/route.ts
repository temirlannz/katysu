import {NextRequest, NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import {getXataClient} from "@/xata";

const xata = getXataClient();

interface studentsPresent {
    studentId: string
    selected: boolean
}

interface PostRequestAttendance {
    currentDate: Date
    studentsAttendance: studentsPresent[],
    groupId: string
}

export async function POST(req: Request) {
    const { userId , orgRole } = auth();
    if (!userId || orgRole === 'org:admin') {
        return NextResponse.error();
    }

    const data: PostRequestAttendance = await req.json();
    const submittedDate = new Date(data.currentDate);

    const records = data.studentsAttendance.map((student) =>  {
        return {
            student: student.studentId,
            isPresent: student.selected,
            date: new Date( submittedDate.getTime() + Math.abs(submittedDate.getTimezoneOffset()*60000) ),
            group: data.groupId
        }
    });

    for (let i = 0; i < records.length; i++) {
        const duplicate = await xata.db.attendance.filter({
            student: data.studentsAttendance[i].studentId,
            date: new Date( submittedDate.getTime() + Math.abs(submittedDate.getTimezoneOffset()*60000) ),
            group: data.groupId
        }).getMany();

        if (duplicate) {
            await xata.db.attendance.delete(duplicate);
        }
    }

    const createRecord = await xata.db.attendance.create(records);

    return NextResponse.json(createRecord)
}

export async function GET(req: NextRequest) {
    const { userId } = auth();

    const classId = req.nextUrl.searchParams.get('classId');
    const groupId = req.nextUrl.searchParams.get('groupId');
    const currentDate = req.nextUrl.searchParams.get('currentDate');
    const toDate = new Date(currentDate as string)


    const getRecords = await xata.db.attendance.filter({
        group: groupId,
        date: new Date( toDate?.getTime() + Math.abs(toDate?.getTimezoneOffset()*60000) )
    }).getMany();

    return NextResponse.json(getRecords);
}