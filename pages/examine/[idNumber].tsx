import React, { useState, useEffect, useRef } from "react";
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
import { QueueDB } from "@/types/QueueDB";

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

export default function ExamineHealthRecordPage() {
  const session = useSession();
  const router = useRouter();
  const idNumber = router.query.idNumber;

  const [patient, setPatient] = useState<PatientDB>();
  const [examinedBy, setExaminedBy] = useState("");
  const [queue, setQueue] = useState<QueueDB>();
  const intervalId = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (idNumber) {
      axios
        .get(`/api/patient?idNumber=${router.query.idNumber}`)
        .then(async ({ data }) => {
          setPatient(data[0]);
          if (data[0].examinedBy && data[0].examinedBy !== "") {
            const nurse = await axios.get(`/api/staff/${data[0].examinedBy}`);
            if (nurse.data) {
              log(nurse.data);
              setExaminedBy(`${nurse.data.firstName} ${nurse.data.lastName}`);
            }
          }
        });
    }
  }, [idNumber, router]);

  useEffect(() => {
    axios.get("/api/queue").then(({ data }) => {
      setQueue(data);
      log(data);
    });
    intervalId.current = setInterval(() => {
      axios.get("/api/queue").then(({ data }) => {
        setQueue(data);
        log(data);
      });
    }, 5000);
  }, []);

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
                <div className="flex flex-col w-full">
                  <h2 className="text-xl font-semibold my-6 mx-2">
                    Patient Profile
                  </h2>
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="firstName">
                        First Name
                      </Label>
                      <span>{patient?.firstName}</span>
                    </div>
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="lastName">
                        Last Name
                      </Label>
                      <span>{patient?.lastName}</span>
                    </div>
                    <div className="flex flex-col m-2 w-16">
                      <Label className="italic text-md" htmlFor="middleInitial">
                        Initials
                      </Label>
                      <span>
                        {patient?.middleInitial ? patient?.middleInitial : "-"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="birthdate">
                        Date of Birth
                      </Label>
                      <span>
                        {patient?.birthdate
                          ? format(new Date(patient?.birthdate), "MMM dd, yyyy")
                          : ""}
                      </span>
                    </div>
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="phone">
                        Phone Number
                      </Label>
                      <span>{patient?.phone ? patient?.phone : "-"}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md">ID Number</Label>
                      <span>{patient?.idNumber}</span>
                    </div>
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="phone">
                        College
                      </Label>
                      <span>{patient?.college}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md">Sex</Label>
                      <span>{patient?.gender}</span>
                    </div>
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="phone">
                        Civil Status
                      </Label>
                      <span>{patient?.civilStatus}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="address">
                        Address
                      </Label>
                      <span>{patient?.address}</span>
                    </div>
                  </div>
                </div>
                <Separator
                  orientation="vertical"
                  className="mx-4 h-auto my-2"
                />
                <div className="w-full h-full flex flex-col gap-5">
                  <div className="flex items-center justify-between mt-6">
                    <h2 className="text-xl font-semibold">
                      Electronic Health Record
                    </h2>
                    {/* {patient?.electronicHealthRecord ? (
                      <p className="italic underline">Verified</p>
                    ) : (
                      <Link
                        className="italic underline"
                        href={`/register?id=${patient?.userID}&edit=true&verify=true`}
                      >
                        Verify
                      </Link>
                    )} */}
                  </div>
                  <div className="flex flex-col grow">
                    {patient?.electronicHealthRecord ? (
                      <p className="italic">
                        <span className="font-semibold not-italic">
                          Last Verified:
                        </span>{" "}
                        {format(
                          new Date(
                            patient.electronicHealthRecord.updatedAt + ""
                          ),
                          "MMMM dd, yyyy hh:mmaa"
                        )}{" "}
                        <br />
                        <span className="font-semibold not-italic">
                          Examined By:
                        </span>{" "}
                        {examinedBy}, RN
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                  {/* <div className="flex flex-col grow">
                    <h2 className="text-xl font-semibold">Consultations</h2>
                    {patient?.consultation ? (
                      <div className="flex justify-between items-center">
                        <p className="pl-4 italic">
                          CN-{patient.consultation.consultationNumber}
                        </p>
                        <Link
                          href={`/examine/intervention/${patient.idNumber}`}
                          className="underline italic"
                        >
                          {format(
                            new Date(patient.consultation.updatedAt + ""),
                            "MMMM dd, yyyy hh:mmaa"
                          )}
                        </Link>
                      </div>
                    ) : (
                      <p className="italic">No consultations yet</p>
                    )}
                  </div> */}
                  <div className="self-end flex gap-1">
                    <Button
                      variant="link"
                      onClick={() => {
                        clearInterval(intervalId.current);
                        router.replace("/examine");
                      }}
                    >
                      BACK
                    </Button>
                    {patient?.electronicHealthRecord ? (
                      <Button
                        onClick={() => {
                          clearInterval(intervalId.current);
                          router.push(
                            `/register?id=${patient?.userID}&edit=true&verify=true`
                          );
                        }}
                      >
                        EXAMINE
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
