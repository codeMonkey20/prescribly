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
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import axios from "axios";
import Patient from "@/models/Patient";
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
        destination: `/register?id=${session.user._id}`,
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

export default function DispenseProfile() {
  const session = useSession();
  const usertype = session.data?.user.usertype;
  const userData = session.data?.user.usertypeData;
  const router = useRouter();
  const [patient, setPatient] = useState<PatientDB>();

  useEffect(() => {
    if (router.query.idNumber) {
      axios.get(`/api/patient?idNumber=${router.query.idNumber}`).then(({ data }) => {
        setPatient(data[0]);
      });
    }
  }, [router]);

  if (session.status === "authenticated")
    return (
      <main className="flex justify-center items-center h-screen">
        <div className="w-11/12 h-5/6 border-4 border-primary bg-primary rounded-3xl flex">
          <div className="w-64 min-h-fit bg-white rounded-l-3xl flex flex-col">
            <div className="p-6 h-64 aspect-square flex items-center justify-center">
              {usertype === "Patient" ? (
                <QRCode value={userData?.idNumber + ""} size={208} />
              ) : (
                <Image src={"/logo.png"} width={150} height={150} alt="logo" />
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
                className="font-semibold text-lg text-center py-2 rounded-l-3xl hover:bg-primary/40 transition-colors duration-200"
                replace
              >
                Patients
              </Link>

              <Link
                href="/dispense"
                className="font-semibold text-lg text-center py-2 rounded-l-3xl transition-colors duration-200 bg-primary"
                replace
              >
                Dispense
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
            <h1 className="text-4xl font-bold my-8 ml-3">Prescribe</h1>
            <div className="bg-white flex grow rounded-3xl px-4 py-2">
              <div className="bg-white flex grow rounded-3xl px-4 py-2">
                <div className="flex flex-col w-full">
                  <h2 className="text-xl font-semibold my-6 mx-2">Patient Profile</h2>
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="firstName">
                        First Name
                      </Label>
                      <span className="font-semibold">{patient?.firstName}</span>
                    </div>
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="lastName">
                        Last Name
                      </Label>
                      <span className="font-semibold">{patient?.lastName}</span>
                    </div>
                    <div className="flex flex-col m-2 w-16">
                      <Label className="italic text-md" htmlFor="middleInitial">
                        Initials
                      </Label>
                      <span className="font-semibold">{patient?.middleInitial ? patient?.middleInitial : "-"}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="birthdate">
                        Date of Birth
                      </Label>
                      <span className="font-semibold">
                        {patient?.birthdate ? format(new Date(patient?.birthdate), "MMM dd, yyyy") : ""}
                      </span>
                    </div>
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="phone">
                        Phone Number
                      </Label>
                      <span className="font-semibold">{patient?.phone}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md">ID Number</Label>
                      <span className="font-semibold">{patient?.idNumber}</span>
                    </div>
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="phone">
                        College
                      </Label>
                      <span className="font-semibold">{patient?.college}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md">Sex</Label>
                      <span className="font-semibold">{patient?.gender}</span>
                    </div>
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="phone">
                        Civil Status
                      </Label>
                      <span className="font-semibold">{patient?.civilStatus}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="address">
                        Address
                      </Label>
                      <span className="font-semibold">{patient?.address}</span>
                    </div>
                  </div>
                </div>
                <Separator orientation="vertical" className="mx-4 h-auto my-2" />
                <div className="w-full flex flex-col">
                  <h2 className="text-xl font-semibold my-6 mx-2">Medical Information</h2>
                  <div className="flex flex-col grow">
                    <div className="flex justify-between">
                      <div className="flex flex-col m-2 grow">
                        <Label className="italic text-md" htmlFor="email">
                          Smoke
                        </Label>
                        <span className="font-semibold">{patient?.smoke ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex flex-col m-2 grow">
                        <Label className="italic text-md" htmlFor="email">
                          Liquor/Alcohol
                        </Label>
                        <span className="font-semibold">{patient?.alcohol ? "Yes" : "No"}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col m-2 grow">
                        <Label className="italic text-md">Allergies</Label>
                        <span className="font-semibold">{patient?.allergies === "" ? "-" : patient?.allergies}</span>
                      </div>
                      <div className="flex flex-col m-2 grow">
                        <Label className="italic text-md">Medications</Label>
                        <span className="font-semibold">
                          {patient?.medications === "" ? "-" : patient?.medications}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col m-2 grow">
                        <Label className="italic text-md">Medical Condition(s)</Label>
                        <span className="font-semibold">
                          {patient?.medicalConditions === "" ? "-" : patient?.medicalConditions}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="self-end flex gap-1">
                    <Button variant="link" onClick={() => router.back()}>BACK</Button>
                    <Button onClick={() => router.push(`/dispense/${router.query.idNumber}/prescription`)}>
                      VIEW PRESCRIPTION
                    </Button>
                  </div>
                </div>
              </div>
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
