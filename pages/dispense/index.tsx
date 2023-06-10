import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { QrScanner } from "@yudiel/react-qr-scanner";
import Header from "@/components/Header";

export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: `/login`,
        permanent: false,
      },
    };
  } else if (!session.user.usertypeID && session.user.usertype !== "Admin") {
    return {
      redirect: {
        destination: `/register/${session.user._id}`,
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

export default function DispensePage() {
  const session = useSession();
  const router = useRouter();

  const [idNumber, setIdNumber] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    axios.get(`/api/patient?idNumber=${idNumber}`).then(({ data }) => {
      if (data.length === 0) {
        setName("");
        return;
      }
      const user = data[0];
      setName(`${user.lastName}, ${user.firstName}`);
    });
  }, [idNumber]);

  if (session.status === "authenticated")
    return (
      <main className="flex justify-center items-center h-screen">
        <div className="w-11/12 h-5/6 border-4 border-primary bg-primary rounded-3xl flex">
          <div className="w-64 min-h-fit bg-white rounded-l-3xl flex flex-col">
            <Header />
          </div>
          <div className="flex flex-col grow px-8 py-5">
            <h1 className="text-4xl font-bold my-8 ml-3">Dispense</h1>
            <div className="bg-white flex flex-col gap-2 items-center grow rounded-3xl px-4 py-2">
              <h2 className="self-start font-semibold text-lg">Patient Identification</h2>
              <p>Place the QR Code within the frame</p>
              <div className="w-52">
                <QrScanner
                  onDecode={(result) => {
                    setIdNumber(result);
                    router.push(`/dispense/${idNumber}`);
                  }}
                  scanDelay={2000}
                  onError={(error) => console.log(error?.message)}
                />
              </div>
              <p>or enter ID number to proceed</p>
              <Input className="w-32" placeholder="0000-0000" onChange={(e) => setIdNumber(e.target.value)} />
              <p className="font-bold text-xl">{name}</p>
              <Button
                onClick={() => {
                  router.push(`/dispense/${idNumber}`);
                }}
                disabled={name === ""}
              >
                Proceed
              </Button>
            </div>
          </div>
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
