import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/libs/auth";
import { signIn } from "@/libs/auth";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input_field";
import { GithubSignIn } from "@/components/github_sign_in";
import { GitLabSignIn } from "@/components/gitlab_sign_in";
import { GoogleSignIn } from "@/components/google_sign_in";
import { actionExecutor } from "@/libs/actionExecutor";


const Page = async () => {
    const session = await auth();
    //jika session ada atau user telah terautentifikasi maka redirect ke halaman /
    if (session) {
        redirect("/");
    }
    
    return (
        <div className="w-full max-w-sm mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

            <GithubSignIn />
            <GitLabSignIn />
            <GoogleSignIn />
            <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
                </span>
            </div>
            </div>

            {/* Email/Password Sign In */}
            <form
            className="space-y-4"
            action={async (formData) => {
                "use server";
                await actionExecutor({
                actionFn: async () => {
                    await signIn("credentials", formData);
                },
                });
            }}
            >
            <InputField
                name="email"
                placeholder="Email"
                type="email"
                required
                autoComplete="email"
            />
            <InputField
                name="password"
                placeholder="Password"
                type="password"
                required
                autoComplete="current-password"
            />
            <Button className="w-full" type="submit">
                Sign In
            </Button>
            </form>

            <div className="text-center">
            <Button asChild variant="link">
                <Link href="/sign-up">Don&apos;t have an account? Sign up</Link>
            </Button>
            </div>
        </div>
    );
}

export default Page;