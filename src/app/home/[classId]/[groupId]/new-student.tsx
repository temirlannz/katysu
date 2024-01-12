'use client';

import React, {useState} from 'react'
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import axios from "axios";
import {toast} from "@/components/ui/use-toast";
import {usePathname, useRouter} from "next/navigation";

interface responseData {
    status: number
    data: {
        group: {
            id: string
        }
        id: string
        name: string
        surname: string
    }
}

const formSchema = z.object({
    name: z.string().min(2).max(20),
    surname: z.string().min(2).max(20),
});

const NewStudent = () => {
    const [message, setMessage] = useState<string>('');
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            surname: ""
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const classAndGroupId: string[] = pathname.replace('/home/', '').split('/');
            const classId: string = classAndGroupId[0];
            const groupId: string = classAndGroupId[1];

            const response: responseData = await axios.post(
                'http://localhost:3000/api/student',
                {
                    values,
                    classId,
                    groupId
                }
            );
            if (response.status !== 200) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                });
            } else {
                router.refresh();

                toast({
                    description: `Student '${response.data.name} ${response.data.surname}' has been added.`,
                });
            }

            return response;
        } catch (error) {
            setMessage('An error occurred while uploading the image.');
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='ghost' className='gap-x-2' >
                    <Plus size={18} />
                    Add student
                </Button>
            </DialogTrigger>


            <DialogContent>
                <DialogTitle>Add student</DialogTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="First name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="surname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Surname" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogClose asChild>
                            <Button type="submit">
                                Submit
                            </Button>
                        </DialogClose>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
export default NewStudent
