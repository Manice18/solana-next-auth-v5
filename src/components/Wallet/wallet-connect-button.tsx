"use client";

import { useEffect, useState } from "react";

import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { Wallet } from "lucide-react";
import bs58 from "bs58";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

import { SigninMessage } from "@/utils/SigninMessage";
import { shortenWalletAddress } from "@/lib/functions";

export default function WalletConnectButton() {
  const { publicKey, connecting, connected, disconnecting, signMessage } =
    useWallet();
  const walletModal = useWalletModal();
  const { status, data: session, update } = useSession();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    if (isSigningIn || status === "loading") return;
    setIsSigningIn(true);
    try {
      if (!connected) {
        walletModal.setVisible(true);
        return;
      }

      if (session && status === "authenticated") {
        return;
      }

      const csrfToken = await getCsrfToken();
      if (!publicKey || !csrfToken || !signMessage) {
        console.error("Wallet is not ready for signing");
        return;
      }

      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: publicKey.toBase58(),
        statement:
          "Welcome to Solana! By signing, you're confirming ownership of the wallet you're connecting. This is a secure, gas-free process that ensures your identity without granting Solana any permission to perform transactions or access your funds. Your security and privacy are always our priority.",
        nonce: csrfToken,
        uri: "https://solana.com/",
        version: "1",
        chainId: "devnet",
        issuedAt: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      });

      const encodedMessage = new TextEncoder().encode(message.prepare());
      const signature = await signMessage(encodedMessage);
      const serializedSignature = bs58.encode(signature);

      const result = await signIn("credentials", {
        message: JSON.stringify(message),
        signature: serializedSignature,
        redirect: false,
      });

      if (result?.error) {
        console.error("Sign-in failed:", result.error);
      } else {
        await update();
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleWalletDisconnect = async () => {
    if (session && status === "authenticated") {
      await signOut({ redirect: false });
    }
  };

  useEffect(() => {
    if (connected && status === "unauthenticated" && !isSigningIn) {
      handleSignIn();
    }
    if (!connected && status === "authenticated") {
      handleWalletDisconnect();
    }
  }, [connected, status, isSigningIn]);

  const getButtonText = () => {
    if (status === "loading" || isSigningIn) return "Connecting...";
    if (!publicKey) return "Connect Wallet";
    return shortenWalletAddress(publicKey.toString());
  };

  return (
    <WalletMultiButton>
      <div className="flex flex-row items-center justify-normal space-x-4">
        {!publicKey && !connecting && !connected && !disconnecting && (
          <Wallet className="size-6" />
        )}
        <p className="whitespace-nowrap text-sm">{getButtonText()}</p>
      </div>
    </WalletMultiButton>
  );
}
