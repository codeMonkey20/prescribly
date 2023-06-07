import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import Image from "next/image";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import PatientsTable from "@/components/tables/PatientsTable";
import { PatientDB } from "@/types/PatientDB";

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

export default function PatientsPage() {
  const session = useSession();
  const user = session.data?.user;
  const usertype = session.data?.user.usertype;
  const userData = session.data?.user.usertypeData;
  const router = useRouter();

  const [patients, setPatients] = useState<PatientDB[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get("/api/patient").then(({ data }) => {
      setLoading(false);
      setPatients(data);
    });
  }, []);

  if (session.status === "authenticated")
    return (
      <main className="flex justify-center items-center h-screen">
        <div className="w-11/12 h-5/6 border-4 border-primary bg-primary rounded-3xl flex">
          <div className="w-64 min-h-fit bg-white rounded-l-3xl flex flex-col">
            <div className="p-6 h-64 aspect-square">
              {usertype === "Patient" ? (
                <QRCode value={userData?.idNumber + ""} size={208} />
              ) : (
                <div className="w-[208px] h-[208px]" />
              )}
            </div>
            <header className="flex flex-col gap-1 grow pl-3 py-3 cursor-pointer">
              <Link
                href="/dashboard"
                className="font-semibold text-lg text-center py-2 rounded-l-3xl hover:bg-primary/40 transition-colors duration-200"
                replace
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="font-semibold text-lg text-center py-2 rounded-l-3xl hover:bg-primary/40 transition-colors duration-200"
                replace
              >
                Profile
              </Link>
              <Link
                href="/patients"
                className="font-semibold text-lg text-center py-2 rounded-l-3xl transition-colors duration-200 bg-primary"
                replace
              >
                Patients
              </Link>

              <Link
                href="/prescribe"
                className="font-semibold text-lg text-center py-2 rounded-l-3xl hover:bg-primary/40 transition-colors duration-200"
                replace
              >
                Prescribe
              </Link>
              <Dialog>
                <DialogTrigger className="font-semibold text-lg text-center py-2 rounded-l-3xl hover:bg-primary/40 transition-colors duration-200">
                  Logout
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Logout</DialogTitle>
                    <DialogDescription>Are you sure to logout?</DialogDescription>
                    <DialogFooter>
                      <Button onClick={() => signOut({ callbackUrl: "/login" })}>Logout</Button>
                    </DialogFooter>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </header>
          </div>
          <div className="flex flex-col grow px-8 py-5">
            <h1 className="text-4xl font-bold my-8 ml-3">Patients</h1>
            <div className="bg-white flex flex-col gap-2 items-center grow rounded-3xl px-4 py-2">
              <h2 className="text-lg font-semibold self-start">Patient Profile</h2>
              <PatientsTable patients={patients} loading={loading} />
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
