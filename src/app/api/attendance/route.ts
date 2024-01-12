import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import {getXataClient} from "@/xata";

const xata = getXataClient();

interface studentsPresent {
    studentId: string
    selected: boolean
}

interface PostRequestAttendance {
    currentDate: Date
    studentsAttendance: studentsPresent[]
}

export async function POST(req: Request) {
    const data: PostRequestAttendance = await req.json();
    const submittedDate = new Date(data.currentDate);

    const records = data.studentsAttendance.map((student) =>  {
        return {
            student: student.studentId,
            isPresent: student.selected,
            date: new Date( submittedDate.getTime() + Math.abs(submittedDate.getTimezoneOffset()*60000) )
        }
    });

    for (let i = 0; i < records.length; i++) {
        const duplicate = await xata.db.attendance.filter({
            student: data.studentsAttendance[i].studentId,
            date: new Date( submittedDate.getTime() + Math.abs(submittedDate.getTimezoneOffset()*60000) )
        }).getMany();

        if (duplicate) {
            await xata.db.attendance.delete(duplicate);
        }
    }

    const createRecord = await xata.db.attendance.create(records);

    return NextResponse.json(createRecord)
}

export async function GET(req: Request) {
    const { userId } = auth();

    const data = await req.json();

    return NextResponse.json(data);
}