import {auth, CreateOrganization} from "@clerk/nextjs";
import {redirect} from "next/navigation";

export default function CreateOrganizationPage() {
    const { userId, orgRole } = auth();

    return (
        <section className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <CreateOrganization
                appearance={{
                    elements: {
                        card: 'rounded-md bg-[#F9F9F9] border shadow-none border-gray-200',
                        headerTitle: 'text-xl',
                        formFieldInput: 'bg-[#F9F9F9]'
                    }
                }}
            />
        </section>
    );
}