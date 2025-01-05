import React from 'react';
import { signIn } from "@/libs/auth";
import { Button } from "@/components/ui/button";
import { GitLabLogo } from '@/components/ui/gitlab_logo';

const GitLabSignIn = () => {
    return (
        <form
            action={async () => {
                "use server";
                await signIn("gitlab");
            }}
        >
            <Button className="w-full" variant="outline">
                <GitLabLogo />
                Sign in with GitLab
            </Button>
        </form>
    )
}

export { GitLabSignIn };