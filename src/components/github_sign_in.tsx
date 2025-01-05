import React from 'react';
import { signIn } from '@/libs/auth';
import { Button } from "@/components/ui/button";
import { GithubLogo } from '@/components/ui/github_logo';

const GithubSignIn = () => {
    return (
        <form
            action={async () => {
                "use server";
                await signIn("github");
            }}
        >
            <Button className="w-full" variant="outline">
                <GithubLogo />
                Sign in with GitHub
            </Button>
        </form>
    )
};

export { GithubSignIn };