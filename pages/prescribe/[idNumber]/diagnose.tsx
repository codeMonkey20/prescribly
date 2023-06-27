import React, { FormEvent, useState, useEffect } from "react";
import QRCode from "react-qr-code";
import Image from "next/image";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { PatientDB } from "@/types/PatientDB";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
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

export default function PrescribeDiagnosePage() {
  const session = useSession();
  const router = useRouter();

  const [patient, setPatient] = useState<PatientDB>();
  const [buttonLoad, setButtonLoad] = useState(false);

  const handlePrescribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!(e.target instanceof HTMLFormElement)) return;
    setButtonLoad(true);

    const formData = new FormData(e.target);
    const formDataJSON = Object.fromEntries(formData.entries());
    await axios.put(`/api/patient/${patient?.userID}`, formDataJSON);
    router.push(`/prescription/${router.query.idNumber}?new=true`);
  };

  useEffect(() => {
    if (router.query.idNumber) {
      axios
        .get(`/api/patient?idNumber=${router.query.idNumber}`)
        .then(({ data }) => {
          setPatient(data[0]);
        });
    }
  }, [router]);

  if (session.status === "authenticated")
    return (
      <main className="flex justify-center items-center h-screen">
        <div className="w-11/12 h-5/6 border-4 border-primary bg-primary rounded-3xl flex">
          <div className="w-64 min-h-fit bg-white rounded-l-3xl flex flex-col">
            <Header />
          </div>
          <div className="flex flex-col grow px-8 py-5">
            <h1 className="text-4xl font-bold my-3 ml-3">Prescribe</h1>
            <form
              className="bg-white flex grow rounded-3xl px-4 py-2"
              onSubmit={handlePrescribe}
            >
              <div className="bg-white flex grow rounded-3xl px-4 py-2">
                <div className="flex flex-col w-full">
                  <h2 className="text-xl font-semibold mx-2">Diagnose</h2>
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="smoke">
                        Smoke:
                      </Label>
                      <RadioGroup
                        name="smoke"
                        id="smoke"
                        className="flex"
                        defaultValue={patient?.smoke ? "yes" : "no"}
                      >
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
                      <RadioGroup
                        id="alcohol"
                        name="alcohol"
                        className="flex"
                        defaultValue={patient?.alcohol ? "yes" : "no"}
                      >
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
                      <Textarea
                        name="allergies"
                        id="allergies"
                        defaultValue={patient?.allergies}
                      />
                    </div>
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="medications">
                        Medication(s)
                      </Label>
                      <Textarea
                        name="medications"
                        id="medications"
                        defaultValue={patient?.medications}
                      />
                    </div>
                  </div>
                  {/* <div className="flex justify-between">
                    <div className="flex flex-col m-2 grow">
                      <Label
                        className="italic text-md"
                        htmlFor="medicalConditions"
                      >
                        Medical Condition(s)
                      </Label>
                      <Textarea
                        name="medicalConditions"
                        id="medicalConditions"
                        defaultValue={patient?.medicalConditions}
                      />
                    </div>
                  </div> */}
                </div>
                <Separator
                  orientation="vertical"
                  className="mx-4 h-auto my-2"
                />
                <div className="w-full flex flex-col">
                  <div>
                    <p className="font-semibold">Vital Signs</p>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="italic text-right">Temperature:</Label>
                      <Input
                        className="h-6 w-full"
                        name="temperature"
                        defaultValue={
                          patient?.electronicHealthRecord?.temperature
                        }
                      />
                      <p>°C</p>
                      <Label className="italic text-right">PR:</Label>
                      <Input
                        className="h-6 w-full"
                        name="pulse"
                        defaultValue={patient?.electronicHealthRecord?.pulse}
                      />
                      <p>bpm</p>
                      <Label className="italic text-right">RR:</Label>
                      <Input
                        className="h-6 w-full"
                        name="respiration"
                        defaultValue={
                          patient?.electronicHealthRecord?.respiration
                        }
                      />
                      <p>bpm</p>
                      <Label className="italic text-right">BP:</Label>
                      <Input
                        className="h-6 w-full"
                        name="bloodPressure"
                        defaultValue={
                          patient?.electronicHealthRecord?.bloodPressure
                        }
                      />
                      <p>mmhg</p>
                      <Label className="italic text-right">WT:</Label>
                      <Input
                        className="h-6 w-full"
                        name="weight"
                        defaultValue={patient?.electronicHealthRecord?.weight}
                      />
                      <p>kg</p>
                      <Label className="italic text-right">Oxygen:</Label>
                      <Input
                        className="h-6 w-full"
                        name="oxygen"
                        defaultValue={patient?.electronicHealthRecord?.oxygen}
                      />
                      <p>
                        O<sup>2</sup> sat
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col grow">
                    <div className="flex justify-between">
                      <div className="flex flex-col m-2 grow">
                        <Label
                          className="italic text-md"
                          htmlFor="healthConditions"
                        >
                          Chief Complaints
                        </Label>
                        <Textarea
                          name="healthConditions"
                          id="healthConditions"
                          defaultValue={patient?.healthConditions}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col m-2 grow">
                        <Label
                          className="italic text-md"
                          htmlFor="currentMedications"
                        >
                          Current Medications Taken:
                        </Label>
                        <Textarea
                          name="currentMedications"
                          id="currentMedications"
                          defaultValue={
                            patient?.consultation?.currentMedications
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="self-end flex gap-1">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => router.back()}
                    >
                      BACK
                    </Button>
                    <Button disabled={buttonLoad}>
                      {buttonLoad ? (
                        <Loader2 className="animate-spin mr-2" />
                      ) : (
                        ""
                      )}
                      PRESCRIBE
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
        <Image
          src="/logo.png"
          alt="logo"
          width={150}
          height={150}
          className="w-auto animate-pulse"
          priority
        />
      </div>
    </main>
  );
}
