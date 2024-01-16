"use client"

import { ColumnDef } from "@tanstack/react-table"
import {MoreHorizontal} from "lucide-react";
import React, {FormEvent, useEffect, useState} from "react";
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
import axios from "axios";
import {toast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@radix-ui/react-menu";
import {Input} from "@/components/ui/input";
import {getXataClient} from "@/xata";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Class = {
    id: string
    name: string
    count: number
    xata: {
        createdAt: Date,
        updatedAt: Date,
        version: number
    }
}

async function editClass (
    classId: string,
    newClassName: string,
    event: FormEvent
    ) {
    event.preventDefault();

    try {
        const response = await axios.put(
            '/api/class',
            { classId, newClassName }
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
                description: `Class has been edited to '${response.data.name}'.`,
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

async function deleteClass (classId: string) {
    try {
        const response = await axios.delete(
            '/api/class',
            { data: { id: classId } }
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
                description: `Class '${response.data.name}' has been deleted.`,
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

let groupOfId: string[] = [];

export const columns: ColumnDef<Class>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "name",
        header: "Class name",
    },
    {
        accessorKey: "count",
        header: "Group count",
        cell: ({ row }) => {

            groupOfId.push(row.getValue('id'));
            groupOfId = groupOfId.filter((id, index) => groupOfId.indexOf(id) === index);

            const [count, setCount] = useState<number[]>([]);

            useEffect(() => {
                async function getCount() {
                    const response = await axios.get(
                        '/api/class',
                        { params: groupOfId }
                    ).then(data => setCount(data.data))
                }

                getCount();
            }, []);

            row.original.count = count[0]

            return row.original.count
        }
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
        cell: ({ row }) => {
            const router = useRouter();
            const [className, setClassName] = useState<string>('');

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
                                    await editClass(row.getValue('id'), className, event);
                                    router.refresh();
                                }}>
                                    <DialogHeader>
                                        <DialogTitle>Edit class name</DialogTitle>
                                        <DialogDescription>
                                            Make changes to your class name here. Click save when you're done.
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
                                                onChange={e => setClassName(e.target.value)}
                                                value={className}
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
                                        This action cannot be undone. This will permanently delete '{row.getValue('name')}'
                                        and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={ async () => {
                                        await deleteClass(row.getValue('id'));
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
