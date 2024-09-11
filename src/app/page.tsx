"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { useSession } from "next-auth/react";

import WalletConnectButton from "@/components/Wallet/wallet-connect-button";
import { shortenWalletAddress } from "@/lib/functions";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <main className="flex flex-col bg-white w-full h-screen text-black space-y-5 items-center justify-center">
      <WalletConnectButton />
      {!session && (
        <>
          <span>You are not signed in</span>
        </>
      )}
      {session && (
        <div className="flex flex-col items-center space-y-2">
          <Image
            width={60}
            height={60}
            src={session.user?.image || ""}
            alt="User Image"
            className="rounded-full"
          />
          <p>
            <span className="font-semibold">Logged in as:</span>{" "}
            {shortenWalletAddress(session.user?.name as string)}
          </p>
        </div>
      )}
      <button
        onClick={() => {
          router.push("/protected");
        }}
        className="font-semibold"
      >
        Click to go to Protected Route
      </button>
    </main>
  );
}
