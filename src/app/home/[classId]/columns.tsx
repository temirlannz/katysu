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

import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {usePathname, useRouter} from "next/navigation";
import axios from "axios";
import {toast} from "@/components/ui/use-toast";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Group = {
    id: string
    name: string
    count: number
    xata: {
        createdAt: Date,
        updatedAt: Date,
        version: number
    }
    classes: {
        id: string
    }
}

async function editGroup (
    groupId: string,
    newGroupName: string,
    event: FormEvent,
    classId: string
) {
    event.preventDefault();

    try {
        const response = await axios.put(
            '/api/group',
            { groupId, newGroupName, classId }
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
                description: `Group has been edited to '${response.data.name}'.`,
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

async function deleteGroup (groupId: string, classId: string) {
    try {
        const response = await axios.delete(
            '/api/group',
            {
                data: { id: groupId, classId }
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
                description: `Group '${response.data.name}' has been deleted.`,
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

export const columns: ColumnDef<Group>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "name",
        header: "Group name",
    },
    {
        accessorKey: "count",
        header: "Student count",
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
            const router = useRouter();
            const pathname = usePathname();
            const classId = pathname.replace('/home/', '');
            const [groupName, setGroupName] = useState<string>('');

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
                                    await editGroup(row.getValue('id'), groupName, event, classId);
                                    router.refresh();
                                }}>
                                    <DialogHeader>
                                        <DialogTitle>Edit group name</DialogTitle>
                                        <DialogDescription>
                                            Make changes to your group name here. Click save when you&apos;re done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label className="text-right">
                                                Name
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder={row.getValue('name')}
                                                onChange={e => setGroupName(e.target.value)}
                                                value={groupName}
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
                                        This action cannot be undone. This will permanently delete &apos;{row.getValue('name')}&apos;
                                        and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={ async () => {
                                        await deleteGroup(row.getValue('id'), classId);
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
