import React, { FormEvent, useState, useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { PrescriptionDB } from "@/types/PrescriptionDB";
import { Loader2 } from "lucide-react";

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
  const idNumber = req.url?.split("/")[2];
  const patient = await Patient.findOne({ idNumber });
  return {
    props: {},
  };
}

export default function PrescribeDiagnosePage() {
  const session = useSession();
  const user = session.data?.user;
  const usertype = session.data?.user.usertype;
  const userData = session.data?.user.usertypeData;
  const router = useRouter();

  const [patient, setPatient] = useState<PatientDB>();
  const [buttonLoad, setButtonLoad] = useState(false);

  const handlePrescribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!(e.target instanceof HTMLFormElement)) return;
    setButtonLoad(true);

    const formData = new FormData(e.target);
    const { healthConditions, ...formDataJSON } = Object.fromEntries(formData.entries());
    const prescription: PrescriptionDB = {
      idNumber: patient?.idNumber,
      healthConditions: healthConditions + "",
      userID: patient?.userID,
    };
    await axios.put(`/api/patient/${patient?.userID}`, formDataJSON);
    const newprescription = await axios.post(`/api/prescription/${patient?.idNumber}`, prescription);
    router.push(`/prescribe/${router.query.idNumber}/diagnose/prescription/${newprescription.data._id}`);
  };

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
                className="font-semibold text-lg text-center py-2 rounded-l-3xl hover:bg-primary/40 transition-colors duration-200"
                replace
              >
                Patients
              </Link>

              <Link
                href="/prescribe"
                className="font-semibold text-lg text-center py-2 rounded-l-3xl hover:bg-primary/40 transition-colors duration-200 bg-primary"
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
            <h1 className="text-4xl font-bold my-8 ml-3">Prescribe</h1>
            <form className="bg-white flex grow rounded-3xl px-4 py-2" onSubmit={handlePrescribe}>
              <div className="bg-white flex grow rounded-3xl px-4 py-2">
                <div className="flex flex-col w-full">
                  <h2 className="text-xl font-semibold my-6 mx-2">Patient Profile</h2>
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="smoke">
                        Smoke:
                      </Label>
                      <RadioGroup name="smoke" id="smoke" className="flex" defaultValue="no">
                        <div className="flex items-center gap-1">
                          <RadioGroupItem id="smoke-yes" value="yes" />
                          <Label htmlFor="smoke-yes">Yes</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem id="smoke-no" value="no" />
                          <Label htmlFor="smoke-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="alcohol">
                        Liquor/Alcohol:
                      </Label>
                      <RadioGroup id="alcohol" name="alcohol" className="flex" defaultValue="no">
                        <div className="flex items-center gap-1">
                          <RadioGroupItem id="alcohol-yes" value="yes" />
                          <Label htmlFor="alcohol-yes">Yes</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem id="alcohol-no" value="no" />
                          <Label htmlFor="alcohol-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="allergies">
                        Allergies
                      </Label>
                      <Textarea name="allergies" id="allergies" />
                    </div>
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="medications">
                        Medication(s)
                      </Label>
                      <Textarea name="medications" id="medications" />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="medicalConditions">
                        Medical Condition(s)
                      </Label>
                      <Textarea name="medicalConditions" id="medicalConditions" />
                    </div>
                  </div>
                </div>
                <Separator orientation="vertical" className="mx-4 h-auto my-2" />
                <div className="w-full flex flex-col">
                  <h2 className="text-xl font-semibold my-6 mx-2">Medical Information</h2>
                  <div className="flex flex-col grow">
                    <div className="flex justify-between">
                      <div className="flex flex-col m-2 grow">
                        <Label className="italic text-md" htmlFor="healthConditions">
                          Current Health Condition(s)
                        </Label>
                        <Textarea name="healthConditions" id="healthConditions" />
                      </div>
                    </div>
                  </div>
                  <div className="self-end flex gap-1">
                    <Button type="button" onClick={() => router.back()}>
                      BACK
                    </Button>
                    <Button disabled={buttonLoad}>
                      {buttonLoad ? <Loader2 className="animate-spin mr-2" /> : ""}PRESCRIBE
                    </Button>
                  </div>
                </div>
              </div>
            </form>
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
