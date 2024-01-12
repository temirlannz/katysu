"use client"

import {
    ColumnDef, ColumnFiltersState,
    flexRender,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {CalendarIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import axios from "axios";
import {toast} from "@/components/ui/use-toast";
import {usePathname} from "next/navigation";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

interface studentPresentData {
    group: {
        id: string
    }
    id: string
    name: string
    surname: string
}

interface student {
    group: {
        id: string
    }
    id: string
    name: string
    surname: string
}

interface studentsPresentData {
    studentId: string
    selected: boolean
}

const getAttendance = async (classId: string, groupId: string) => {
    const data = await axios.get('/api/attendance', {
        data: {
            classId,
            groupId
        }
    });
    console.log(data)

    return data;
}

export function DataTable<TData extends studentPresentData, TValue>({
                                             columns,
                                             data,
                                         }: DataTableProps<TData, TValue>) {
    const pathname = usePathname();
    const classAndGroupId: string[] = pathname.replace('/home/', '').split('/');
    const classId: string = classAndGroupId[0];
    const groupId: string = classAndGroupId[1];


    const [rowSelection, setRowSelection] = React.useState({});
    const [currentDate, setCurrentDate] = useState<Date | undefined>(new Date(new Date().setHours(0,0,0,0)));
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [students, setStudents] = useState<student[]>(data);

    useEffect(() => setStudents(data), [data]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange: setRowSelection,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            rowSelection,
            columnFilters,
        }
    });

    async function saveAttendance(
        currentDate: Date | undefined | string,
        studentsAttendance: studentsPresentData[],
    ) {
        try {
            setIsLoading(true);
            const response = await axios.post(
                '/api/attendance',
                {
                    currentDate,
                    studentsAttendance,
                }
            );
            if (response.status !== 200) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                });
                setIsLoading(false);
                console.log(response);
            } else {
                setIsLoading(false);
                toast({
                    description: `Attendance have been saved.`,
                });
            }
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "You are not authorized.",
            });
            setIsLoading(false);
            console.log(err)
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between pb-2">
                <div className={cn("grid gap-2")}>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "w-[300px] justify-start text-left font-normal pl-2",
                                    !currentDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />

                                {currentDate ? format(currentDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={new Date()}
                                onDayClick={day => setCurrentDate(day)}
                                disabled={(currentDate) =>
                                    currentDate > new Date() || currentDate < new Date("2024-1-1")
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <Input
                    placeholder="Filter by name..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No students yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    <Button
                        variant={ currentDate ? 'default' : 'outline' }
                        className='mr-2 disabled:opacity-100 disabled:text-muted-foreground disabled:font-medium'
                        disabled={!currentDate || isLoading}
                        onClick={async () => {

                            // RETURN SELECTED STUDENTS
                            const selectedStudents = Object.keys(rowSelection).map(item => {
                                const selectedStudentsId: TData | string = table.getRow(item).original.id;

                                return selectedStudentsId
                            });

                            // RETURN ATTENDANCE, MAPS THROUGH SELECTED STUDENTS
                            const studentsAttendace = students.map(student => {
                                const isStudentSelected = selectedStudents.includes(student.id);

                                return { studentId: student.id, selected: isStudentSelected }
                            });

                            await saveAttendance(
                                currentDate,
                                studentsAttendace,
                            );
                        }}
                    >
                        {isLoading && (
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </Button>
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} student(s) present.
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
