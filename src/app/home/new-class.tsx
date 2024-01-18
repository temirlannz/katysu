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
import {useRouter} from "next/navigation";
import {auth} from "@clerk/nextjs";
import Spinner from "@/components/ui/spinner";

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
    name: z.string().min(2).max(50),
});

const NewClass = () => {
    const [message, setMessage] = useState<string>('');
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);
            const response: responseData = await axios.post(
                'http://localhost:3000/api/class',
                {values}
            );
            if (response.status !== 200) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                });
                setOpen(false);
                setIsLoading(false);
            } else {
                router.refresh();

                toast({
                    description: `Class ${response.data.name} has been created.`,
                });
                setOpen(false);
                setIsLoading(false);
            }

            return response;
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "You are not authorized.",
            });
            setOpen(false);
            setIsLoading(false);

            console.log(error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='ghost' className='gap-x-2' >
                    <Plus size={18} />
                    New class
                </Button>
            </DialogTrigger>


            <DialogContent>
                <DialogTitle>Add new class</DialogTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    {/*<FormLabel>Add new class</FormLabel>*/}
                                    <FormControl>
                                        <Input placeholder="Class name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            onClick={() => setOpen(true)}
                            disabled={isLoading}
                        >
                            { isLoading && <Spinner /> }
                            { isLoading ? 'Submitting...' : 'Submit' }
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
export default NewClass
