import { buttonVariants } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl mb-8">
        Customer Management & Invoice Tracking Application - JOB assesment
      </h1>

      {session ? (
        // If user is logged in
        <div className="text-center">
          <p className="text-lg mb-4">
            You are logged in! Go to the Customer page to see the details.
          </p>
          <Link href="/customers" className={buttonVariants()}>
            Go to Customer Page
          </Link>
        </div>
      ) : (
        // If user is not logged in
        <div className="text-center">
          <p className="text-lg mb-4">Please sign in to access your account.</p>
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
}
