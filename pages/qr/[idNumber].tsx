import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";

export default function ViewQRPage() {
  const { query, push } = useRouter();
  const idNumber = query.idNumber?.toString();

  if (idNumber)
    return (
      <main className="h-screen bg-primary p-8">
        <div className="bg-white rounded-3xl p-4 flex flex-col h-full">
          <h1 className="font-bold text-3xl">QR Code</h1>
          <div className="flex grow items-center justify-center">
            {idNumber === "" || idNumber === undefined ? (
              <Loader2 className="animate-spin w-20 h-20" />
            ) : (
              <div>
                <QRCode value={idNumber} />
                <p className="italic font-semibold text-center text-lg mt-2">{idNumber}</p>
              </div>
            )}
          </div>
          {idNumber !== "" || idNumber !== undefined ? (
            <>
              <p className="text-center">
                Please save a screenshot of your QR Code and present it everytime you visit the clinic
              </p>
              <div className="flex justify-end gap-2">
                <Button onClick={() => window.print()} className="bg-[#DA812E] hover:bg-[#DA812E]/80">
                  PRINT
                </Button>
                <Button
                  variant="secondary"
                  className="px-6"
                  onClick={() => {
                    push("/patients");
                  }}
                >
                  EXIT
                </Button>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </main>
    );

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="flex flex-col justify-center items-center gap-3">
        <Image src="/logo.png" alt="logo" width={150} height={150} className="w-auto animate-pulse" priority />
      </div>
    </main>
  );
}
