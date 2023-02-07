import Link from "next/link";
import React from "react";
import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
      <h1 className="p-4 font-bold text-3xl">Doge NFT Marketplace</h1>
      <div className="flex flex-row items-center gap-4">
        <Link href="/">Home</Link>
        <Link href="/sell-nft">Sell NFT</Link>
        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  );
}
