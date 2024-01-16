"use client"

import { ColumnDef } from "@tanstack/react-table"
import {MoreHorizontal} from "lucide-react";
import React, {FormEvent, useState} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useRouter, usePathname} from "next/navigation";
import axios from "axios";
import {toast} from "@/components/ui/use-toast";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Student = {
    id: string
    name: string
    surname: string
    xata: {
        createdAt: Date,
        updatedAt: Date,
        version: number
    }
    group: {
        id: string
    }
}

interface responseData {
    data: {
        group: {id: string}
        id: string
        name: string
        surname: string
    },
    status: number
}

async function editStudent(
    studentId: string,
    studentName: string,
    studentSurname: string,
    groupId: string,
    classId: string,
    event: FormEvent,
) {
    event.preventDefault();

    try {
        const response: responseData = await axios.put(
            '/api/student',
            {
                studentId,
                studentName,
                studentSurname,
                groupId,
                classId,
            }
        );
        console.log(response)

        if (response.status !== 200) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            });

            console.log(response);
        } else {
            toast({
                description: `Student has been edited to '${response.data.name} ${response.data.surname}'.`,
            });
        }
    } catch (err) {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "You are not authorized.",
        });

        console.log(err)
    }
}

async function deleteStudent(
    studentId: string,
    groupId: string,
    classId: string,
) {
    try {
        const response = await axios.delete(
            '/api/student',
            {
                data: {
                    studentId,
                    groupId,
                    classId,
                }
            }
        );
        if (response.status !== 200) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            });

            console.log(response);
        } else {
            toast({
                description: `Student '${response.data.name}' has been deleted.`,
            });
        }
    } catch (err) {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "You are not authorized.",
        });

        console.log(err)
    }
}

export const columns: ColumnDef<Student>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        )
    },
    {
        accessorKey: "name",
        header:  "First Name",
    },
    {
        accessorKey: "surname",
        header: "Surname",
    },
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "xata.createdAt",
        header: "Creation date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("xata_createdAt"));
            const formatted = date.toLocaleString();

            return <>{formatted}</>
        },
    },
    {
        id: "actions",
        cell: function CellFn ({ row }) {
            const [studentName, setStudentName] = useState<string>('');
            const [studentSurname, setStudentSurname] = useState<string>('');
            const pathname = usePathname();
            const router = useRouter();
            const classAndGroupId: string[] = pathname.replace('/home/', '').split('/');
            const classId: string = classAndGroupId[0];
            const groupId: string = classAndGroupId[1];

            return (
                <DropdownMenu>
                    <AlertDialog>
                        <Dialog>
                            <DropdownMenuTrigger asChild className='z-20'>
                                <Button variant="ghost" className="h-8 w-8 p-0 z-20">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4 z-20" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className='bg-[#F9F9F9]'>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className='w-full text-left'>
                                    <DialogTrigger className='w-full text-left'>
                                        Edit
                                    </DialogTrigger>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <AlertDialogTrigger className='w-full text-left'>Delete</AlertDialogTrigger>
                                </DropdownMenuItem>
                            </DropdownMenuContent>

                            <DialogContent className="sm:max-w-[425px]">
                                <form onSubmit={async (event) => {
                                    await editStudent(
                                        row.getValue('id'),
                                        studentName,
                                        studentSurname,
                                        groupId,
                                        classId,
                                        event
                                    );
                                    router.refresh();
                                }}>
                                    <DialogHeader>
                                        <DialogTitle>Edit student name</DialogTitle>
                                        <DialogDescription>
                                            Make changes to your student name and surname here. Click save when you&apos;re done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="flex flex-col justify-between gap-4">
                                            <Label className="text-left">
                                                First name
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder={row.getValue('name')}
                                                onChange={e => setStudentName(e.target.value)}
                                                value={studentName}
                                                className="col-span-3"
                                            />
                                            <Label className="text-left">
                                                Surname
                                            </Label>
                                            <Input
                                                id="surname"
                                                placeholder={row.getValue('surname')}
                                                onChange={e => setStudentSurname(e.target.value)}
                                                value={studentSurname}
                                                className="col-span-3"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button
                                                type="submit"
                                            >
                                                Save changes
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </form>
                            </DialogContent>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete &apos;{row.getValue('name')} {row.getValue('surname')}&apos;
                                        and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={ async () => {
                                        await deleteStudent(
                                            row.getValue('id'),
                                            groupId,
                                            classId,
                                        );
                                        router.refresh();
                                    }}>
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </Dialog>
                    </AlertDialog>
                </DropdownMenu>
            )
        },
    },
]
