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
import {auth} from "@clerk/nextjs";

interface responseData {
    status: number
    data: {
        count: number
        id: string
        memberId: string
        name: string
    }
}

const formSchema = z.object({
    name: z.string().min(2).max(20),
});

const NewGroup = () => {
    const [message, setMessage] = useState<string>('');
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const classId = pathname.replace('/home/', '');

            const response: responseData = await axios.post(
                'http://localhost:3000/api/group',
                {
                    values,
                    classId,
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
                    description: `Group ${response.data.name} has been created.`,
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
                    Add group
                </Button>
            </DialogTrigger>


            <DialogContent>
                <DialogTitle>Add group</DialogTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    {/*<FormLabel>Add new class</FormLabel>*/}
                                    <FormControl>
                                        <Input placeholder="Group name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogClose asChild>
                            <Button type="submit">Submit</Button>
                        </DialogClose>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
export default NewGroup
