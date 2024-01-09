import {getXataClient} from "@/xata";
import {auth} from "@clerk/nextjs";
import {NextResponse} from "next/server";

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