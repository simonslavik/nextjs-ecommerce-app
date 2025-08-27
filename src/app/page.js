'use client'


import Image from "next/image";
import { useContext } from "react";
import { GlobalContext } from "@/context"; 


export default function Home() {

  const {isAuthUser} = useContext(GlobalContext);

  

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Welcome to Our Store</h1>
        <p className="text-lg">Discover the best products at unbeatable prices.</p>
      </main>
    </div>
  );
}
