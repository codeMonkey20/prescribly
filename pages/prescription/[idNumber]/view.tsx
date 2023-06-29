import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PatientDB } from "@/types/PatientDB";
import { Prescription } from "@/types/Prescription";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { FaPrescription } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "../../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { StaffDB } from "@/types/StaffDB";
import Image from "next/image";
import { format } from "date-fns";
import ageDate from "@/lib/ageDate";
import { Skeleton } from "@/components/ui/skeleton";

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default function PrescriptionPageView() {
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;
  const [patient, setPatient] = useState<PatientDB>();
  const [tableData, setTableData] = useState<Prescription[]>([]);
  const [staff, setStaff] = useState<StaffDB>();

  useEffect(() => {
    if (router.query.idNumber) {
      axios
        .get(`/api/patient?idNumber=${router.query.idNumber}`)
        .then(({ data }) => {
          setPatient(data[0]);
          setTableData(data[0]?.prescription);
        });
    }
  }, [router.query.idNumber, user?.usertype]);

  useEffect(() => {
    if (patient && patient.doctor && patient.doctor !== "") {
      axios.get(`/api/staff/${patient?.doctor}`).then(({ data }) => {
        setStaff(data);
      });
    }
  }, [patient]);

  if (session.status === "authenticated" && user && patient)
    return (
      <main className="bg-primary h-screen flex flex-col items-center justify-center p-10 gap-3">
        <h1 className="font-bold text-3xl self-start">Prescription</h1>
        <div className="relative rounded-3xl bg-white w-full py-3 px-4 flex flex-col gap-2 grow">
          <div className="absolute z-10 mx-auto left-0 right-0 text-center">
            <p className="text-center">
              <span className="text-sm">Republic of the Philippines</span>{" "}
              <br />
              Mindanao State University - Iligan Institute of Technology <br />
              Andre Bonifacio Avenue, 9200 Iligan City
            </p>
            <p className="mb-2">
              {tableData[0].createdAt
                ? format(new Date(tableData[0].createdAt + ""), "MMMM dd, yyyy")
                : ""}
            </p>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="italic font-bold">Chief Complaints:</p>
              <p className="px-3">{patient?.healthConditions}</p>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex">
                <div className="text-right font-semibold flex flex-col justify-end">
                  <p>{patient.fullName}</p>
                  <p>{ageDate(patient.birthdate + "")}</p>
                  <p>{patient.gender}</p>
                  <p>{patient.address ? patient.address : "-"}</p>
                </div>
              </div>
            </div>
          </div>
          <FaPrescription className="text-5xl" />
          <div className="grow max-h-full overflow-y-auto">
            <Table className="max-h-96 overflow-y-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="border-r">Purpose</TableHead>
                  <TableHead className="border-r">Medication Name</TableHead>
                  <TableHead className="border-r">Dosage</TableHead>
                  <TableHead className="border-r">Form</TableHead>
                  <TableHead className="border-r">Route</TableHead>
                  <TableHead className="border-r">Frequency</TableHead>
                  <TableHead className="border-r">Duration of TX</TableHead>
                  <TableHead className="border-r w-10">Dispense</TableHead>
                  <TableHead className="border-r w-10">Given</TableHead>
                  <TableHead className="border-r">Remarks</TableHead>
                  <TableHead className="border-r">Date and Time</TableHead>
                  <TableHead>RN</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((e: Prescription, i) => (
                  <TableRow key={`userrow-${i}`}>
                    <TableCell className="p-1 border-r">{e.purpose}</TableCell>
                    <TableCell className="p-1 border-r">
                      {e.medicationName}
                    </TableCell>
                    <TableCell className="p-1 flex items-center gap-2 border-r">
                      {e.dosage}
                    </TableCell>
                    <TableCell className="p-1 border-r">{e.form}</TableCell>
                    <TableCell className="p-1 border-r">{e.route}</TableCell>
                    <TableCell className="p-1 border-r">
                      {e.frequency}
                    </TableCell>
                    <TableCell className="p-1 border-r">{e.duration}</TableCell>
                    <TableCell className="p-1 border-r">{e.dispense}</TableCell>
                    <TableCell className="p-1 border-r">{e.given}</TableCell>
                    <TableCell className="p-1 border-r">{e.remarks}</TableCell>
                    <TableCell className="p-1 border-r">
                      {e.updatedAt
                        ? format(
                            new Date(e.updatedAt + ""),
                            "MMMM dd, yyyy h:mm aa"
                          )
                        : ""}
                    </TableCell>
                    <TableCell className="p-1">
                      {patient.pharmacist && patient.pharmacist !== ""
                        ? patient.pharmacist
                        : ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <div className="flex gap-3 items-center">
              <p className="whitespace-nowrap">
                {"Doctor's Remarks: " +
                  (patient.comments ? patient.comments : "")}
              </p>
            </div>
          </div>
          <div className="self-end justify-self-end flex justify-between w-full gap-1">
            {staff ? (
              <p className="font-bold text-sm">
                {staff?.signature ? (
                  <Image
                    src={"data:image/png;base64," + staff?.signature}
                    alt="sign"
                    width={80}
                    height={80}
                  />
                ) : (
                  ""
                )}
                {staff ? (
                  `Dr. ${staff?.firstName} ${staff?.lastName}`
                ) : (
                  <Skeleton className="w-28 h-6" />
                )}
                <br />
                {staff?.license ? staff?.license : "-"} <br />
                {staff?.phone ? staff?.phone : "-"} <br />
                MSU-IIT Clinic
              </p>
            ) : (
              <p className="font-semibold italic">Doctor Deleted in Database</p>
            )}

            <div className="flex items-end gap-1 print:hidden">
              <Button onClick={() => router.back()} variant="link">
                BACK
              </Button>
              <Button
                onClick={() => window.print()}
                className="bg-[#DA812E] hover:bg-[#DA812E]/80"
              >
                PRINT
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  else return <></>;
}
