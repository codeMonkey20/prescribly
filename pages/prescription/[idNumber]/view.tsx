import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {
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
      axios.get(`/api/patient?idNumber=${router.query.idNumber}`).then(({ data }) => {
        setPatient(data[0]);
        setTableData(data[0]?.prescription);
      });
    }
  }, [router.query.idNumber, user?.usertype]);

  useEffect(() => {
    if (patient) {
      axios.get(`/api/staff/${patient?.doctor}`).then(({ data }) => {
        setStaff(data);
      });
    }
  }, [patient]);

  if (session.status === "authenticated" && user && patient)
    return (
      <main className="bg-primary h-screen flex flex-col items-center justify-center p-10 gap-3">
        <h1 className="font-bold text-3xl self-start">Prescription</h1>
        <div className="rounded-3xl bg-white w-full py-3 px-4 flex flex-col gap-2 grow">
          <div className="flex items-start justify-between">
            <div>
              <p className="italic font-bold">Current Health Condition(s:)</p>
              <p className="px-3">{patient?.healthConditions}</p>
            </div>
            <div className="flex flex-col justify-center">
              <QRCode value={`${patient?.idNumber}`} size={80} />
              <p className="w-20 text-center">{patient?.idNumber}</p>
            </div>
          </div>
          <FaPrescription className="text-5xl" />
          <div className="grow">
            <Table className="max-h-96 overflow-y-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="border-r">Purpose</TableHead>
                  <TableHead className="border-r">Medication Name</TableHead>
                  <TableHead className="border-r">Dosage</TableHead>
                  <TableHead className="border-r">Form</TableHead>
                  <TableHead className="border-r">Route</TableHead>
                  <TableHead className="border-r">Frequency</TableHead>
                  <TableHead className="border-r">Dispense</TableHead>
                  <TableHead className="border-r">Given</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((e: Prescription, i) => (
                  <TableRow key={`userrow-${i}`}>
                    <TableCell className="p-1 border-r">{e.purpose}</TableCell>
                    <TableCell className="p-1 border-r">{e.medicationName}</TableCell>
                    <TableCell className="p-1 flex items-center gap-2 border-r">{e.dosage}</TableCell>
                    <TableCell className="p-1 border-r">{e.form}</TableCell>
                    <TableCell className="p-1 border-r">{e.route}</TableCell>
                    <TableCell className="p-1 border-r">{e.frequency}</TableCell>
                    <TableCell className="p-1 border-r">{e.dispense}</TableCell>
                    <TableCell className="p-1 border-r">{e.given}</TableCell>
                    <TableCell className="p-1">{e.remarks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="self-end justify-self-end flex justify-between w-full gap-1">
            <p className="font-bold">
              <Image src={"data:image/png;base64," + staff?.signature} alt="sign" width={80} height={80} />
              {`Dr. ${staff?.firstName} ${staff?.lastName}`}
              <br />
              {staff?.license ? staff?.license : "00-XXXXX-00"} <br />
              {staff?.phone ? staff?.phone : "N/A"} <br />
              MSU-IIT Clinic
            </p>

            <div className="flex items-end gap-1 print:hidden">
              <Button onClick={() => router.back()} variant="link">
                BACK
              </Button>
              <Button onClick={() => window.print()} className="bg-[#DA812E] hover:bg-[#DA812E]/80">
                PRINT
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  else return <></>;
}
