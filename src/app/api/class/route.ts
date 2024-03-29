import {getXataClient} from "@/xata";
import {auth} from "@clerk/nextjs";
import {NextRequest, NextResponse} from "next/server";

const xata = getXataClient();

interface PostRequestData  {
    values: {
        name: string
    }
}

interface DeleteRequestData {
    count: number
    id: string
    memberId: string
    name: string
    xata: {
        createdAt: Date,
        updatedAt: Date,
        version: number
    }
}

interface PutRequestData {
    classId: string
    newClassName: string
}

export async function POST(req: Request) {
    const { userId, orgRole } = auth();

    if (!userId || orgRole === 'org:admin') {
        return NextResponse.error();
    }

    const findMember = await xata.db.member.filter({ memberId: userId }).getFirst();
    if (!findMember) {
        await xata.db.member.createOrReplace({ memberId: userId });
    }

    const data: PostRequestData = await req.json();
    const name = data.values.name;

    const createNewClass = await xata.db.classes.create({
        name: name,
        memberId: userId as string
    });

    return NextResponse.json(createNewClass);
}

export async function DELETE(req: Request) {
    const { userId, orgRole } = auth();
    const data: DeleteRequestData = await req.json();

    const findClass = await xata.db.classes.read(data.id);
    if (userId !== findClass?.memberId) {
        return NextResponse.error();
    }

    const findGroups = await xata.db.group.filter({ classes: data.id }).getMany();

    for (let i = 0; i < findGroups.length; i++) {
        const findStudents = await xata.db.student.filter({ group: findGroups[i].id }).getMany();

        for (let j = 0; j < findStudents.length; j++) {
            const findAttendance = await xata.db.attendance.filter({ student: findStudents[j].id }).getMany();
            const deleteAttendance = await xata.db.attendance.delete(findAttendance);
        }

        const deleteStudents = await xata.db.student.delete(findStudents);
    }

    const deleteGroup = await xata.db.group.delete(findGroups);
    const deleteClass = await xata.db.classes.delete(data.id);

    return NextResponse.json(deleteClass);
}

export async function PUT(req: Request) {
    const { userId } = auth();
    const data: PutRequestData = await req.json();

    const findClass = await xata.db.classes.read(data.classId);

    if (!findClass) {
        return NextResponse.error();
    }

    if (userId !== findClass?.memberId) {
        return NextResponse.error();
    }

    const editClass = await xata.db.classes.update(data.classId, { name: data.newClassName })


    return NextResponse.json(editClass);
}

export async function GET(req: NextRequest) {
    const classId = req.nextUrl.searchParams.get('classId');

    const records = await xata.db.group.filter({ classes: classId }).summarize({
        summaries: {
            "total": {"count": "*"}
        }
    });

    return NextResponse.json({classId, total: records.summaries[0].total})
}