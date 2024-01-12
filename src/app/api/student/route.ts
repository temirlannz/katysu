import {auth} from "@clerk/nextjs";
import {NextResponse} from "next/server";
import {getXataClient} from "@/xata";

const xata = getXataClient();

interface PostRequestStudent {
    values: {
        name: string
        surname: string
    }
    classId: string
    groupId: string
}

interface DeleteRequestStudent {
    studentId: string
    groupId: string
    classId: string
}

interface PutRequestStudent {
    studentId: string
    studentName: string
    studentSurname: string
    groupId: string
    classId: string
}

export async function POST(req: Request) {
    const { userId, orgRole } = auth();

    if (!userId || orgRole === 'org:admin') {
        return NextResponse.error();
    }

    const data: PostRequestStudent = await req.json();
    const name = data.values.name;
    const surname = data.values.surname;
    const classId = data.classId;
    const groupId = data.groupId;

    const findClass = await xata.db.classes.read(classId);
    if (findClass?.memberId !== userId) {
        return NextResponse.error();
    }
    const findGroup = await xata.db.group.read(groupId);
    if (findGroup?.classes?.id !== findClass?.id) {
        return NextResponse.error();
    }

    const addStudent = await xata.db.student.create({
        name: name,
        surname: surname,
        group: groupId
    });

    return NextResponse.json(addStudent);
}

export async function DELETE(req: Request) {
    const { userId } = auth();
    const data: DeleteRequestStudent = await req.json();

    const findClass = await xata.db.classes.read(data.classId);
    if (userId !== findClass?.memberId) {
        return NextResponse.error();
    }
    const findGroup = await xata.db.group.read(data.groupId);
    if (findGroup?.classes?.id !== findClass?.id) {
        return NextResponse.error();
    }
    const findStudent = await xata.db.student.read(data.studentId);
    if (findGroup?.id !== findStudent?.group?.id) {
        return NextResponse.error();
    }

    const deleteStudent = await xata.db.student.delete(data.studentId);

    return NextResponse.json(deleteStudent);
}

export async function PUT(req: Request) {
    const { userId } = auth();
    const data: PutRequestStudent = await req.json();

    const findClass = await xata.db.classes.read(data.classId);
    if (findClass?.memberId !== userId) {
        return NextResponse.error();
    }
    const findGroup = await xata.db.group.read(data.groupId);
    if (findClass?.id !== findGroup?.classes?.id) {
        return NextResponse.error();
    }
    const findStudent = await xata.db.student.read(data.studentId);
    if (findGroup?.id !== findStudent?.group?.id) {
        return NextResponse.error();
    }

    const editStudent = await xata.db.student.update(
        data.studentId,
        {
            name: data.studentName,
            surname: data.studentSurname
        }
    );

    return NextResponse.json(editStudent);
}