import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PatientDB } from "@/types/PatientDB";
import { Prescription } from "@/types/Prescription";
import { PrescriptionDB } from "@/types/PrescriptionDB";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";

type Props = {};

export default function PrescriptionTable({}: Props) {
  const router = useRouter();
  const [patient, setPatient] = useState<PatientDB>();
  const [tableData, setTableData] = useState<Prescription[]>();
  const [currPrescription, setCurrPrescription] = useState<PrescriptionDB>();
  const [buttonLoad, setButtonLoad] = useState(false);

  useEffect(() => {
    if (router.query.idNumber && router.query.prescriptionID) {
      axios.get(`/api/patient?idNumber=${router.query.idNumber}`).then(({ data }) => {
        setPatient(data[0]);
      });
      axios.get(`/api/prescription/${router.query.prescriptionID}`).then(({ data }) => {
        setCurrPrescription(data);
      });
    }
  }, [router]);

  return (
    <main className="bg-primary h-screen flex flex-col items-center justify-center p-10 gap-3">
      <h1 className="font-bold text-3xl self-start">Prescription</h1>
      <div className="rounded-3xl bg-white w-full py-3 px-4 flex flex-col grow">
        <div className="flex items-start justify-between">
          <div>
            <p className="italic font-bold">Current Health Condition(s:)</p>
            <p className="px-3">{currPrescription?.healthConditions}</p>
          </div>
          <div className="flex flex-col justify-center">
            <QRCode value={`${patient?.idNumber}`} size={80} />
            <p className="w-20 h-20 text-center">{patient?.idNumber}</p>
          </div>
        </div>
        <Button
          className="self-end"
          onClick={() => {
            const prescrption: Prescription = {
              dispense: "",
              dosage: "",
              form: "",
              frequency: "",
              given: "",
              medicationName: "",
              purpose: "",
              remarks: "",
              route: "",
            };
            setTableData((row) => {
              if (row) {
                return [...row, prescrption];
              }
              return [prescrption];
            });
          }}
        >
          Add Row
        </Button>
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
              {tableData?.map((e: Prescription, i) => (
                <TableRow key={`userrow-${i}`}>
                  <TableCell>
                    <Input
                      className="h-6"
                      value={e.purpose}
                      onChange={(input) => {
                        setTableData((old) => {
                          const copy: Prescription[] = JSON.parse(JSON.stringify(old));
                          copy[i].purpose = input.target.value;
                          return copy;
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      className="h-6"
                      value={e.medicationName}
                      onChange={(input) => {
                        setTableData((old) => {
                          const copy: Prescription[] = JSON.parse(JSON.stringify(old));
                          copy[i].medicationName = input.target.value;
                          return copy;
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      className="h-6"
                      value={e.dosage}
                      onChange={(input) => {
                        setTableData((old) => {
                          const copy: Prescription[] = JSON.parse(JSON.stringify(old));
                          copy[i].dosage = input.target.value;
                          return copy;
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      className="h-6"
                      value={e.form}
                      onChange={(input) => {
                        setTableData((old) => {
                          const copy: Prescription[] = JSON.parse(JSON.stringify(old));
                          copy[i].form = input.target.value;
                          return copy;
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      className="h-6"
                      value={e.route}
                      onChange={(input) => {
                        setTableData((old) => {
                          const copy: Prescription[] = JSON.parse(JSON.stringify(old));
                          copy[i].route = input.target.value;
                          return copy;
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      className="h-6"
                      value={e.frequency}
                      onChange={(input) => {
                        setTableData((old) => {
                          const copy: Prescription[] = JSON.parse(JSON.stringify(old));
                          copy[i].frequency = input.target.value;
                          return copy;
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      className="h-6"
                      value={e.dispense}
                      onChange={(input) => {
                        setTableData((old) => {
                          const copy: Prescription[] = JSON.parse(JSON.stringify(old));
                          copy[i].dispense = input.target.value;
                          return copy;
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input className="h-6" disabled />
                  </TableCell>
                  <TableCell>
                    <Input className="h-6" disabled />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="self-end justify-self-end">
          <Button
            onClick={async () => {
              console.log(tableData);
              if (tableData?.length === 0 || !tableData) return;
              setButtonLoad(true);
              const prescription: PrescriptionDB = {
                prescriptions: tableData,
                healthConditions: currPrescription?.healthConditions,
                idNumber: currPrescription?.idNumber,
                userID: currPrescription?.userID,
              };
              const res = await axios.put(`/api/prescription/${router.query.prescriptionID}`, prescription);
              console.log(res.data);
              setButtonLoad(false);
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
