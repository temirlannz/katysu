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
import Spinner from "@/components/ui/spinner";

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
        cell: function CellFn ({ row }) {
            const groupId = row.getValue('id');
            const [total, setTotal] = useState<{ total: number }>({ total: 0 });
            const [isLoading, setIsLoading] = useState<boolean>(false);

            async function getCount() {
                try {
                    setIsLoading(true);
                    const data = await axios
                        .get('/api/group', {params: {groupId}})
                        .then(res => {
                            setTotal(res.data)
                            setIsLoading(false)
                        });
                } catch (error) {
                    console.log(error);
                    setIsLoading(false);
                }
            }

            useEffect(() => {
                getCount();
            }, []);

            return <>{isLoading ? <Spinner className='text-black' /> : total.total}</>
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
            const pathname = usePathname();
            const classId = pathname.replace('/home/', '');
            const [groupName, setGroupName] = useState<string>('');
            const [isLoading, setIsLoading] = useState<boolean>(false);
            const [open, setOpen] = useState<boolean>(false);
            const [openDialog, setOpenDialog] = useState<boolean>(false);

            async function editGroup (
                groupId: string,
                newGroupName: string,
                event: FormEvent,
                classId: string
            ) {
                event.preventDefault();

                setIsLoading(true);
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
                        setOpenDialog(false);
                        setIsLoading(false);

                        console.log(response);
                    } else {
                        toast({
                            description: `Group has been edited to '${response.data.name}'.`,
                        });
                        setOpenDialog(false);
                        setIsLoading(false);
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

            async function deleteGroup (groupId: string, classId: string) {
                try {
                    setIsLoading(true);
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
                        setOpen(false);
                        setIsLoading(false);

                        console.log(response);
                    } else {
                        toast({
                            description: `Group '${response.data.name}' has been deleted.`,
                        });
                        setOpen(false);
                        setIsLoading(false);
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
                                        await deleteGroup(row.getValue('id'), classId);
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
