import React from 'react';
import { signIn } from "@/libs/auth";
import { Button } from "@/components/ui/button";
import { GoogleLogo } from "@/components/ui/google_logo";

const GoogleSignIn = () => {
    return (
        <form
            action={async () => {
                "use server";
                await signIn("google");
            }}
        >
            <Button className="w-full" variant="outline">
                <GoogleLogo />
                Sign in with Google
            </Button>
        </form>
    )
};

export { GoogleSignIn };