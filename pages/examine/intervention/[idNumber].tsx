import React, { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import axios from "axios";
import { PatientDB } from "@/types/PatientDB";
import Header from "@/components/Header";
import Link from "next/link";
import log from "@/lib/log";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import InterventionsTable from "@/components/tables/InterventionsTable";
import { Consultation } from "@/types/Consultation";
import { Loader2 } from "lucide-react";

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

type Body = Consultation & {
  vitals?: {
    bloodPressure?: string;
    pulse?: number;
    respiration?: number;
    temperature?: number;
    weight?: number;
    oxygen?: number;
  };
};

export default function ExamineInterventionPage() {
  const session = useSession();
  const router = useRouter();
  const idNumber = router.query.idNumber;
  const newConsultation = router.query.new === "true";

  const [patient, setPatient] = useState<PatientDB>();
  const [buttonLoad, setButtonLoad] = useState(false);
  const [consultationNumber, setConsultationNumber] = useState(0);

  log(consultationNumber);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!(e.target instanceof HTMLFormElement)) return;
    setButtonLoad(true);
    const form = new FormData(e.target);
    const {
      bloodPressure,
      currentMedications,
      healthConditions,
      pulse,
      respiration,
      temperature,
      weight,
      oxygen,
    } = JSON.parse(JSON.stringify(Object.fromEntries(form.entries())));
    const body: Body = {};
    if (!patient?.consultation?.consultationNumber) {
      body.consultationNumber = consultationNumber;
    }
    body.interventions = JSON.parse(
      JSON.stringify(patient?.consultation?.interventions)
    );
    body.currentMedications = currentMedications;
    body.vitals = {
      bloodPressure,
      pulse,
      respiration,
      temperature,
      weight,
      oxygen,
    };
    delete body.createdAt;
    delete body.updatedAt;
    if (body.interventions) {
      for (const i of body.interventions) {
        delete i.createdAt;
        delete i.updatedAt;
      }
    }
    const { vitals, ...newBody } = body;
    log(newBody);
    if (patient?.consultation?.consultationNumber) {
      await axios.put(`/api/patient/consultations/${patient?.userID}`, newBody);
    } else {
      await axios.post(
        `/api/patient/consultations/${patient?.userID}`,
        newBody
      );
    }
    await axios.put(`/api/patient/${patient?.userID}`, {
      healthConditions,
      electronicHealthRecord: { ...vitals },
    });
    await axios.delete(`/api/queue?nurse=${1}`);
    await axios.post(`/api/queue?doctor=${patient?.idNumber}`);
    router.push(`/examine`);
  };

  useEffect(() => {
    if (idNumber) {
      axios
        .get(`/api/patient?idNumber=${router.query.idNumber}`)
        .then(async ({ data }) => {
          setPatient(data[0]);
          const nurse = await axios.get(`/api/staff/${data[0].examinedBy}`);
          log(nurse.data);
        });
    }
    axios
      .get("/api/patient/consultations/count")
      .then(({ data }) => setConsultationNumber(data.count));
  }, [idNumber, router]);

  if (session.status === "authenticated" && patient)
    return (
      <main className="flex justify-center items-center h-screen">
        <div className="w-11/12 h-5/6 border-4 border-primary bg-primary rounded-3xl flex">
          <div className="w-64 min-h-fit bg-white rounded-l-3xl flex flex-col">
            <Header />
          </div>
          <div className="flex flex-col grow px-8 py-5">
            <h1 className="text-4xl font-bold my-8 ml-3">Examine</h1>
            <div className="bg-white flex grow rounded-3xl px-4 py-2">
              <div className="bg-white flex grow rounded-3xl px-4 py-2">
                <form
                  id="form"
                  className="flex flex-col w-full gap-2"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <p className="font-semibold">Vital Signs</p>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="italic text-right">Temperature:</Label>
                      <Input
                        className="h-6 w-full"
                        name="temperature"
                        defaultValue={
                          patient.electronicHealthRecord?.temperature
                        }
                      />
                      <p>°C</p>
                      <Label className="italic text-right">PR:</Label>
                      <Input
                        className="h-6 w-full"
                        name="pulse"
                        defaultValue={patient.electronicHealthRecord?.pulse}
                      />
                      <p>bpm</p>
                      <Label className="italic text-right">RR:</Label>
                      <Input
                        className="h-6 w-full"
                        name="respiration"
                        defaultValue={
                          patient.electronicHealthRecord?.respiration
                        }
                      />
                      <p>bpm</p>
                      <Label className="italic text-right">BP:</Label>
                      <Input
                        className="h-6 w-full"
                        name="bloodPressure"
                        defaultValue={
                          patient.electronicHealthRecord?.bloodPressure
                        }
                      />
                      <p>mmhg</p>
                      <Label className="italic text-right">WT:</Label>
                      <Input
                        className="h-6 w-full"
                        name="weight"
                        defaultValue={patient.electronicHealthRecord?.weight}
                      />
                      <p>kg</p>
                      <Label className="italic text-right">Oxygen:</Label>
                      <Input
                        className="h-6 w-full"
                        name="oxygen"
                        defaultValue={patient.electronicHealthRecord?.oxygen}
                      />
                      <p>
                        O<sup>2</sup> sat
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label>Chief Complaints</Label>
                    <Textarea
                      name="healthConditions"
                      defaultValue={patient.healthConditions}
                    />
                  </div>
                  <div>
                    <Label>Current Medications Taken</Label>
                    <Textarea
                      name="currentMedications"
                      defaultValue={
                        patient.consultation?.currentMedications
                          ? patient.consultation?.currentMedications
                          : ""
                      }
                    />
                  </div>
                </form>
                <Separator
                  orientation="vertical"
                  className="mx-4 h-auto my-2"
                />
                <div className="w-full flex flex-col">
                  <h2 className="font-semibold">Nursing Interventions</h2>
                  <p className="italic">
                    Consultation Number: CN-
                    {patient.consultation?.consultationNumber &&
                    !newConsultation
                      ? patient.consultation.consultationNumber
                      : consultationNumber}
                  </p>
                  <InterventionsTable
                    patient={patient}
                    setPatient={setPatient}
                  />
                  <div className="self-end flex gap-1">
                    <Button variant="link" onClick={() => router.back()}>
                      BACK
                    </Button>
                    {session.data.user.usertype === "Nurse" ? (
                      <Button form="form" disabled={buttonLoad}>
                        {buttonLoad ? (
                          <Loader2 className="animate-spin mr-2" />
                        ) : (
                          ""
                        )}
                        SAVE
                      </Button>
                    ) : (
                      ""
                    )}
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
