import Hero from "@/app/components/Hero";
import React from "react";
import Features from "@/app/components/Features";
import {redirect} from "next/navigation";
import {auth} from "@clerk/nextjs";

export default async function Home() {

    return (
        <>
            <Hero />
            <Features />
        </>
    )
}
