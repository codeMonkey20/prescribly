import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";

export default function QRPage() {
  const { query } = useRouter();
  const [idNumber, setIdNumber] = useState("");

  useEffect(() => {
    if ((idNumber === "" || idNumber === undefined) && query.id) {
      axios.get(`/api/patient/${query.id}`).then(({ data }) => {
        setIdNumber(data.idNumber);
      });
    }
  }, [query, idNumber]);

  return (
    <main className="h-screen bg-primary p-8">
      <div className="bg-white rounded-3xl p-4 flex flex-col h-full">
        <h1 className="font-bold text-3xl">QR Code</h1>
        {idNumber === "" || idNumber === undefined ? (
          <p className="text-center text-xl my-4">Please wait for you personal QR Code.</p>
        ) : (
          <>
            <h2 className="text-center text-3xl font-bold italic">Congratulations!</h2>
            <h3 className="text-center text-lg font-semibold italic">Registration Complete!</h3>
          </>
        )}
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
            <div className="flex justify-end">
              <Button
                variant="secondary"
                className="px-6"
                onClick={() => {
                  signOut({ callbackUrl: "/" });
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
}
