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
import Spinner from "@/components/ui/spinner";

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
        cell: function CellFn ({ row }) {

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
        cell: function CellFn ({ row }) {
            const router = useRouter();
            const [className, setClassName] = useState<string>('');
            const [isLoading, setIsLoading] = useState<boolean>(false);
            const [open, setOpen] = useState<boolean>(false);
            const [openDialog, setOpenDialog] = useState<boolean>(false);

            async function deleteClass (classId: string) {
                try {
                    setIsLoading(true);
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
                        setOpen(false);
                        setIsLoading(false);
                        console.log(response);
                    } else {
                        setOpen(false);
                        setIsLoading(false);
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
                    setOpen(false);
                    setIsLoading(false);

                    console.log(err)
                }
            }

            async function editClass (
                classId: string,
                newClassName: string,
                event: FormEvent
            ) {
                event.preventDefault();

                try {
                    setIsLoading(true);
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
                        setOpenDialog(false);
                        setIsLoading(false);

                        console.log(response);
                    } else {
                        setOpenDialog(false);
                        setIsLoading(false);
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
                    setOpenDialog(false);
                    setIsLoading(false);

                    console.log(err)
                }
            }

            return (
                <DropdownMenu>
                    <AlertDialog open={open} onOpenChange={setOpen}>
                        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
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
                                    setOpenDialog(true);
                                    await editClass(row.getValue('id'), className, event);
                                    router.refresh();
                                }}>
                                    <DialogHeader>
                                        <DialogTitle>Edit class name</DialogTitle>
                                        <DialogDescription>
                                            Make changes to your class name here. Click save when you&apos;re done.
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
                                                required
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            onClick={() => setOpenDialog(true)}
                                            disabled={isLoading}
                                        >
                                            { isLoading && <Spinner /> }
                                            { isLoading ? 'Saving...' : 'Save changes' }
                                        </Button>
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
                                    <Button onClick={ async () => {
                                        setOpen(true);
                                        await deleteClass(row.getValue('id'));
                                        router.refresh();
                                    }}
                                            disabled={isLoading}
                                    >
                                        { isLoading && <Spinner /> }
                                        { isLoading ? 'Deleting...' : 'Continue' }
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </Dialog>
                    </AlertDialog>
                </DropdownMenu>
            )
        },
    },
]
