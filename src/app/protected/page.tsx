"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [session, router]);

  if (!session) {
    return (
      <main className="flex flex-col bg-white w-full h-screen text-black space-y-5 items-center justify-center">
        <h1>You are not signed in, Redirecting....</h1>
      </main>
    );
  }

  return (
    <main className="flex flex-col bg-white w-full h-screen text-black space-y-5 items-center justify-center">
      <h1>Protected Route</h1>
    </main>
  );
};

export default Page;
