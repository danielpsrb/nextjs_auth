"use client"

import { Button } from "@/components/ui/button";
import { signOut } from 'next-auth/react';

const SignOut = () => {

    const handleSignOutBtn = async () => {
        await signOut();
    }

    return (
        <div className="flex justify-center">
            <Button variant="destructive" onClick={handleSignOutBtn}>Sign Out</Button>
        </div>
    )
};

export default SignOut;