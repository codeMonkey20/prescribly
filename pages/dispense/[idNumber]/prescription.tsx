import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PatientDB } from "@/types/PatientDB";
import { Prescription } from "@/types/Prescription";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";

export default function DisposePrescription() {
  const router = useRouter();
  const [patient, setPatient] = useState<PatientDB>({});
  const [tableData, setTableData] = useState<Prescription[]>([]);
  const [buttonLoad, setButtonLoad] = useState(false);

  useEffect(() => {
    if (router.query.idNumber) {
      axios.get(`/api/patient?idNumber=${router.query.idNumber}`).then(({ data }) => {
        setPatient(data[0]);
        setTableData(data[0].prescription);
      });
    }
  }, [router]);

  return (
    <main className="bg-primary h-screen flex flex-col items-center justify-center p-10 gap-3">
      <h1 className="font-bold text-3xl self-start">Prescription</h1>
      <div className="rounded-3xl bg-white w-full py-3 px-4 flex flex-col grow">
        <div className="flex items-start justify-between">
          <div>
            <p className="italic font-bold">Current Health Condition(s):</p>
            <p className="px-3">{patient?.healthConditions}</p>
          </div>
          <div className="flex flex-col justify-center">
            <QRCode value={`${patient?.idNumber}`} size={80} />
            <p className="w-20 h-20 text-center">{patient?.idNumber}</p>
          </div>
        </div>
        <div className="grow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Purpose</TableHead>
                <TableHead>Medication Name</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Form</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Dispense</TableHead>
                <TableHead>Given</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((e: Prescription, i) => (
                <TableRow key={`userrow-${i}`}>
                  <TableCell>{e.purpose}</TableCell>
                  <TableCell>{e.medicationName}</TableCell>
                  <TableCell>{e.dosage}</TableCell>
                  <TableCell>{e.form}</TableCell>
                  <TableCell>{e.route}</TableCell>
                  <TableCell>{e.frequency}</TableCell>
                  <TableCell>{e.dispense}</TableCell>
                  <TableCell>
                    <Input
                      className="h-6"
                      value={e.given}
                      onChange={(input) => {
                        setTableData((old) => {
                          const copy: Prescription[] = JSON.parse(JSON.stringify(old));
                          copy[i].given = input.target.value;
                          return copy;
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      className="h-6"
                      value={e.remarks}
                      onChange={(input) => {
                        setTableData((old) => {
                          const copy: Prescription[] = JSON.parse(JSON.stringify(old));
                          copy[i].remarks = input.target.value;
                          return copy;
                        });
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="self-end justify-self-end">
          <Button variant="link" onClick={() => router.back()}>BACK</Button>
          <Button
            onClick={async () => {
              if (tableData?.length === 0 || !tableData) return;
              setButtonLoad(true);
              await axios.put(`/api/patient/${patient?.userID}`, { ...patient, prescription: tableData });
              router.push("/patients");
            }}
            disabled={buttonLoad}
          >
            {buttonLoad ? <Loader2 className="animate-spin mr-2" /> : ""}
            SAVE
          </Button>
        </div>
      </div>
    </main>
  );
}
