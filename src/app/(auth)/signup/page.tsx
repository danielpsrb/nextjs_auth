
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/libs/auth";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input_field";
import { signUpAction } from "@/libs/handleSignUpActions";

const Page = async () => {

    const session = await auth();
    if (session) {
        redirect("/");
    }

    return (
        <div className="w-full max-w-sm mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
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

            {/* Email/Password Sign Up */}
            <form
                className="space-y-4"
                action={async (formData) => {
                    "use server";
                    const res = await signUpAction(formData);
                    if (res.success) {
                        redirect("/sign-in");
                    }
                }}
            >
                <InputField
                    name="username"
                    type="text"
                    placeholder="username"
                    required
                />
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
                    autoComplete="new-password"
                />
                <InputField
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    type="password"
                    required
                    autoComplete="new-password"
                />
                <Button className="w-full" type="submit">
                    Sign Up
                </Button>
            </form>
        </div>
    )
}

export default Page;