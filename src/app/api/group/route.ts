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

export async function POST(req: NextRequest) {
    const { userId, orgRole } = auth();

    if (!userId || orgRole === 'org:admin') {
        return NextResponse.error();
    }

    const data: PostRequestData = await req.json();
    const name = data.values.name;
    const classId = data.classId;

    const createGroup = await xata.db.group.create({
        name: name,
        classes: classId
    });

    return NextResponse.json(createGroup);
}