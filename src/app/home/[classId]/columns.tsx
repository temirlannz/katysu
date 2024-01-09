"use client"

import { ColumnDef } from "@tanstack/react-table"
import {MoreHorizontal} from "lucide-react";
import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";

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
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className='bg-[#F9F9F9]'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
