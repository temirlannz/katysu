import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from "@/app/components/Navbar";
import {ClerkProvider} from "@clerk/nextjs";
import {Toaster} from "@/components/ui/toaster";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Katysu',
  description: 'Katysu. An application for attendance tracking, no papers are needed now and the data is securely stored.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
        <html lang="en" className='overflow-hidden'>
            <body className={inter.className}>
                <header className='py-5 sm:py-10'>
                    <Navbar />
                </header>
                <main>
                    { children }
                </main>
                <Toaster />
            </body>
        </html>
    </ClerkProvider>
  )
}
