import { Button } from "@/components/ui/button";
import { Check, CheckCheckIcon } from "lucide-react";
import { useRouter } from "next/router";
import React from "react";

export default function DoneQueue() {
  const router = useRouter();
  return (
    <main className="bg-primary h-screen flex flex-col items-center justify-center p-10 gap-3">
      <h1 className="font-bold text-3xl self-start">Queued</h1>
      <div className="rounded-3xl bg-white w-full py-3 px-4 grow flex flex-col items-center justify-center gap-10">
        <p className="text-center text-3xl italic">
          Your Chief Complaint/s is already queued. <br />
          Please visit the clinic and wait for your queue.
        </p>
        <Check className="w-32 h-32" />
        <Button className="px-10" onClick={() => router.push("/login")}>EXIT</Button>
      </div>
    </main>
  );
}
