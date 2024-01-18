import {NextRequest, NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import {getXataClient} from "@/xata";

const xata = getXataClient();

interface PostRequestData {
    values: {
        name: string
    },
    classId: string
}

interface DeleteRequestData {
    id: string,
    classId: string
}

interface PutRequestData {
    groupId: string,
    newGroupName: string,
    classId: string
}

export async function POST(req: NextRequest) {
    const { userId, orgRole } = auth();

    if (!userId || orgRole === 'org:admin') {
        return NextResponse.error();
    }

    const data: PostRequestData = await req.json();
    const name = data.values.name;
    const classId = data.classId;

    const member = await xata.db.member.filter({memberId: userId}).getFirst();

    const createGroup = await xata.db.group.create({
        name: name,
        classes: classId,
        member: member
    });

    return NextResponse.json(createGroup);
}

export async function DELETE(req: Request) {
    const { userId, orgRole } = auth();
    const data: DeleteRequestData = await req.json();

    const findClass = await xata.db.classes.read(data.classId);
    if (userId !== findClass?.memberId) {
        return NextResponse.error();
    }
    const findGroup = await xata.db.group.read(data.id);
    if (findGroup?.classes?.id !== findClass?.id) {
        return NextResponse.error();
    }

    const findStudents = await xata.db.student.filter({ group: data.id }).getMany()

   for (let i = 0; i < findStudents.length; i++) {
       const findAttendance = await xata.db.attendance.filter({ student: findStudents[i].id }).getMany();
       const deleteAttendance = await xata.db.attendance.delete(findAttendance);
   }

    const deleteStudents = await xata.db.student.delete(findStudents);
    const deleteGroup = await xata.db.group.delete(data.id);

    return NextResponse.json(deleteGroup);
}

export async function PUT(req: Request) {
    const { userId, orgRole } = auth();
    const data: PutRequestData = await req.json();

    const findClass = await xata.db.classes.read(data.classId);
    if (userId !== findClass?.memberId) {
        return NextResponse.error();
    }
    const findGroup = await xata.db.group.read(data.groupId);
    if (findGroup?.classes?.id !== findClass?.id) {
        return NextResponse.error();
    }

    const editGroup = await xata.db.group.update(data.groupId, { name: data.newGroupName });

    return NextResponse.json(editGroup);
}

export async function GET(req: NextRequest) {
    const groupId = req.nextUrl.searchParams.get('groupId');

    const records = await xata.db.student.filter({ group: groupId }).summarize({
        summaries: {
            "total": {"count": "*"}
        }
    });

    return NextResponse.json({groupId, total: records.summaries[0].total})
}