import { SignOut } from "@/components/sign_out";
import { auth } from "@/libs/auth";
import { redirect } from "next/navigation";

const Page = async () => {

  const session = await auth();
  if (!session) redirect("/sign-in");

  return (
    <>
      <div className="bg-gray-100 rounded-lg p-4 text-center mb-6">
        <p className="text-gray-800">Sign In as: </p>
        <p className="font-semibold">{session.user?.email}</p>
      </div>

      <div className="mt-4">
        <SignOut />
      </div>
    </>
  );
}

export default Page;