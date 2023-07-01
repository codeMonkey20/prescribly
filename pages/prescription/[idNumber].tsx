import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { FaPrescription } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { StaffDB } from "@/types/StaffDB";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import ageDate from "@/lib/ageDate";
import { MimsDB } from "@/types/MimsDB";
import Autocomplete from "@/components/Autocomplete";
import log from "@/lib/log";

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

type UnitData = {
  duration: string;
  dosage: string;
};

export default function PrescriptionPage() {
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;
  const [patient, setPatient] = useState<PatientDB>();
  const [tableData, setTableData] = useState<Prescription[]>([]);
  const [buttonLoad, setButtonLoad] = useState(false);
  const [staff, setStaff] = useState<StaffDB>();
  const [unitData, setUnitData] = useState<UnitData[]>([]);
  const [medicationName, setMedicationName] = useState<string[]>([]);
  const newPrescription = router.query.new === "true";
  const [frequency, setFrequency] = useState<string[]>([]);
  const [dosage, setDosage] = useState<string[]>([]);
  const [form, setForm] = useState<string[]>([]);

  useEffect(() => {
    if (router.query.idNumber) {
      axios
        .get(`/api/patient?idNumber=${router.query.idNumber}`)
        .then(({ data }) => {
          setPatient(data[0]);
          setPatient((old) => ({ comments: "", ...old }));
          if (!newPrescription) {
            setTableData(data[0]?.prescription);
            if (data[0]?.prescription) {
              setUnitData(
                data[0]?.prescription.map((e: Prescription) => {
                  return {
                    dosage: e.dosage.split(" ")[1],
                    duration: e.duration.split(" ")[1],
                  };
                })
              );
            }
          }
        });

      axios.get("/api/mims?type=medicine").then(({ data }) => {
        setMedicationName(data.map((e: MimsDB) => e.name));
      });
      axios.get("/api/mims?type=frequency").then(({ data }) => {
        setFrequency(data.map((e: MimsDB) => e.name));
      });
      axios.get("/api/mims?type=dosage").then(({ data }) => {
        setDosage(data.map((e: MimsDB) => e.name));
      });
      axios.get("/api/mims?type=form").then(({ data }) => {
        setForm(data.map((e: MimsDB) => e.name));
      });
    }
  }, [newPrescription, router, user?.usertype]);

  useEffect(() => {
    if (session.data && session.data.user) {
      axios
        .get(
          `/api/staff/${
            session.data.user.usertype === "Pharmacist" && patient?.doctor
              ? patient?.doctor
              : session.data.user._id
          }`
        )
        .then(({ data }) => {
          setStaff(data);
        });
    }
  }, [patient?.doctor, session.data]);

  if (session.status === "authenticated" && user && patient)
    return (
      <main className="bg-primary h-screen flex flex-col items-center justify-center p-10 gap-3">
        <h1 className="font-bold text-3xl self-start">Prescription</h1>
        <div className="relative rounded-3xl bg-white w-full h-full py-3 px-4 flex flex-col gap-2 grow">
          <div className="flex items-start justify-between">
            <div>
              <p className="italic font-bold">Chief Complaints:</p>
              <p className="px-3">{patient?.healthConditions}</p>
            </div>
            <div className="absolute z-10 mx-auto left-0 right-0 text-center">
              <p className="text-center">
                <span className="text-sm">Republic of the Philippines</span>{" "}
                <br />
                Mindanao State University - Iligan Institute of Technology{" "}
                <br />
                Andre Bonifacio Avenue, 9200 Iligan City
              </p>
              <p className="mb-2">
                {!newPrescription
                  ? tableData[0].createdAt
                    ? format(
                        new Date(tableData[0].createdAt + ""),
                        "MMMM dd, yyyy"
                      )
                    : ""
                  : format(new Date(), "MMMM dd, yyyy")}
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex">
                <div className="text-right font-semibold flex flex-col justify-end">
                  <p>{patient.fullName}</p>
                  <p>{patient?.idNumber}</p>
                  <p>{ageDate(patient.birthdate + "")}</p>
                  <p>{patient.gender}</p>
                  <p>{patient.address ? patient.address : "-"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <FaPrescription className="text-5xl" />
          </div>
          <div className="grow max-h-full overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {user.usertype === "Doctor" && newPrescription ? (
                    <TableHead></TableHead>
                  ) : (
                    ""
                  )}
                  <TableHead className="border-r w-fit">Purpose</TableHead>
                  <TableHead className="border-r w-fit">
                    Medication Name
                  </TableHead>
                  <TableHead className="border-r w-fit">Dosage</TableHead>
                  <TableHead className="border-r w-fit">Form</TableHead>
                  <TableHead className="border-r w-fit">Route</TableHead>
                  <TableHead className="border-r w-fit">Frequency</TableHead>
                  <TableHead className="border-r w-fit">
                    Duration of TX
                  </TableHead>
                  <TableHead className="border-r w-10">Dispense</TableHead>
                  <TableHead className="border-r w-10">Given</TableHead>
                  <TableHead className="border-r w-fit">Remarks</TableHead>
                  <TableHead className="border-r w-fit">
                    Date and Time
                  </TableHead>
                  <TableHead>RN</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((e: Prescription, i) => (
                  <TableRow key={`userrow-${i}`}>
                    {user.usertype === "Doctor" && newPrescription ? (
                      <TableCell className="p-1">
                        <div
                          className="p-2 rounded-full hover:bg-muted flex items-center justify-center aspect-square"
                          onClick={() => {
                            setTableData((old) => {
                              return old.filter((_, idx) => idx !== i);
                            });
                            setUnitData((old) => {
                              return old.filter((_, idx) => idx !== i);
                            });
                          }}
                        >
                          <Trash2 className="w-5" />
                        </div>
                      </TableCell>
                    ) : (
                      ""
                    )}
                    <TableCell className="p-1 border-r">
                      <Input
                        value={e.purpose}
                        disabled={user.usertype === "Pharmacist"}
                        onChange={(input) => {
                          setTableData((old) => {
                            const copy: Prescription[] = JSON.parse(
                              JSON.stringify(old)
                            );
                            copy[i].purpose = input.target.value;
                            return copy;
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell className="p-1 border-r">
                      <Autocomplete
                        data={medicationName}
                        value={e.medicationName}
                        disabled={user.usertype === "Pharmacist"}
                        setValue={setTableData}
                        index={i}
                        onChange={(input) => {
                          setTableData((old) => {
                            const copy: Prescription[] = JSON.parse(
                              JSON.stringify(old)
                            );
                            copy[i].medicationName = input.target.value;
                            return copy;
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell className="px-1 flex items-center gap-2 border-r">
                      <Input
                        className="w-16"
                        value={
                          !newPrescription ? e.dosage.split(" ")[0] : e.dosage
                        }
                        disabled={user.usertype === "Pharmacist"}
                        onChange={(input) => {
                          setTableData((old) => {
                            const copy: Prescription[] = JSON.parse(
                              JSON.stringify(old)
                            );
                            copy[i].dosage = input.target.value;
                            return copy;
                          });
                        }}
                      />
                      <Select
                        disabled={user.usertype === "Pharmacist"}
                        value={
                          !newPrescription
                            ? e.dosage.split(" ")[1]
                            : unitData[i].dosage
                        }
                        onValueChange={(input) => {
                          setUnitData((old) => {
                            const copy = JSON.parse(JSON.stringify(old));
                            copy[i].dosage = input;
                            return copy;
                          });
                        }}
                      >
                        <SelectTrigger>
                          <div className="w-fit">
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="h-60 overflow-y-hidden">
                          {dosage.map((e, i) => (
                            <SelectItem key={`dosage-${i}`} value={e}>
                              {e}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-1 border-r">
                      <div className="flex items-center gap-2">
                        <Select
                          value={e.form}
                          disabled={user.usertype === "Pharmacist"}
                          onValueChange={(input) => {
                            setTableData((old) => {
                              const copy = JSON.parse(JSON.stringify(old));
                              copy[i].form = input;
                              return copy;
                            });
                          }}
                        >
                          <SelectTrigger>
                            <div className="w-fit">
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {form.map((e, i) => (
                              <SelectItem key={i} value={e}>
                                {e}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className="p-1 border-r">
                      <Select
                        value={e.route}
                        disabled={user.usertype === "Pharmacist"}
                        onValueChange={(input) => {
                          setTableData((old) => {
                            const copy = JSON.parse(JSON.stringify(old));
                            copy[i].route = input;
                            return copy;
                          });
                        }}
                      >
                        <SelectTrigger>
                          <div className="w-fit">
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="h-60 overflow-y-auto">
                          <SelectItem value="oral">oral</SelectItem>
                          <SelectItem value="sublingual">sublingual</SelectItem>
                          <SelectItem value="buccal">buccal</SelectItem>
                          <SelectItem value="intravenous">
                            intravenous
                          </SelectItem>
                          <SelectItem value="intramuscular">
                            intramuscular
                          </SelectItem>
                          <SelectItem value="subcutaneous">
                            subcutaneous
                          </SelectItem>
                          <SelectItem value="inhalation">inhalation</SelectItem>
                          <SelectItem value="nasal">nasal</SelectItem>
                          <SelectItem value="rectal">rectal</SelectItem>
                          <SelectItem value="vaginal">vaginal</SelectItem>
                          <SelectItem value="cutaneous">cutaneous</SelectItem>
                          <SelectItem value="otic">otic</SelectItem>
                          <SelectItem value="ocular">ocular</SelectItem>
                          <SelectItem value="transdermal">
                            transdermal
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-1 border-r">
                      <Select
                        disabled={user.usertype === "Pharmacist"}
                        value={e.frequency}
                        onValueChange={(input) => {
                          setTableData((old) => {
                            const copy = JSON.parse(JSON.stringify(old));
                            copy[i].frequency = input;
                            return copy;
                          });
                        }}
                      >
                        <SelectTrigger>
                          <div className="w-fit">
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="h-60 overflow-y-auto">
                          {frequency.map((e, i) => (
                            <SelectItem key={i} value={e}>
                              {e}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="px-1 flex items-center gap-2 border-r">
                      <Input
                        className="w-10"
                        value={
                          !newPrescription
                            ? e.duration.split(" ")[0]
                            : e.duration
                        }
                        disabled={user.usertype === "Pharmacist"}
                        onChange={(input) => {
                          setTableData((old) => {
                            const copy: Prescription[] = JSON.parse(
                              JSON.stringify(old)
                            );
                            copy[i].duration = input.target.value;
                            return copy;
                          });
                        }}
                      />
                      <Select
                        disabled={user.usertype === "Pharmacist"}
                        value={
                          !newPrescription
                            ? e.duration.split(" ")[1]
                            : unitData[i].duration
                        }
                        onValueChange={(input) => {
                          setUnitData((old) => {
                            const copy = JSON.parse(JSON.stringify(old));
                            copy[i].duration = input;
                            return copy;
                          });
                        }}
                      >
                        <SelectTrigger>
                          <div className="w-fit">
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day/s">day/s</SelectItem>
                          <SelectItem value="week/s">week/s</SelectItem>
                          <SelectItem value="month/s">month/s</SelectItem>
                          <SelectItem value="year/s">year/s</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-1 border-r">
                      <Input
                        value={e.dispense}
                        disabled={user.usertype === "Pharmacist"}
                        onChange={(input) => {
                          setTableData((old) => {
                            const copy: Prescription[] = JSON.parse(
                              JSON.stringify(old)
                            );
                            copy[i].dispense = input.target.value;
                            return copy;
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell className="p-1 border-r">
                      <Input
                        value={e.given}
                        disabled={user.usertype === "Doctor"}
                        onChange={(input) => {
                          setTableData((old) => {
                            const copy: Prescription[] = JSON.parse(
                              JSON.stringify(old)
                            );
                            copy[i].given = input.target.value;
                            return copy;
                          });
                          setTableData((old) => {
                            const copy: Prescription[] = JSON.parse(
                              JSON.stringify(old)
                            );
                            if (copy[i].given === "0")
                              copy[i].remarks = "Out of stock";
                            else if (
                              copy[i].given === copy[i].dosage.split(" ")[0]
                            )
                              copy[i].remarks = "Complete";
                            return copy;
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell className="p-1 border-r">
                      <Input
                        value={e.remarks}
                        disabled={user.usertype === "Doctor"}
                        onChange={(input) => {
                          setTableData((old) => {
                            const copy: Prescription[] = JSON.parse(
                              JSON.stringify(old)
                            );
                            copy[i].remarks = input.target.value;
                            return copy;
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell className="p-1 border-r">
                      {!newPrescription
                        ? format(new Date(), "MMMM dd, yyyy h:mm aa")
                        : ""}
                    </TableCell>
                    <TableCell className="p-1">
                      {patient.pharmacist && patient.pharmacist !== ""
                        ? patient.pharmacist
                        : user.usertype === "Pharmacist"
                        ? `${user.firstName} ${user.lastName}`
                        : ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {user.usertype === "Doctor" && newPrescription ? (
              <Button
                className="w-fit"
                onClick={() => {
                  const prescrption: Prescription = {
                    dispense: "",
                    dosage: "",
                    form: "tab",
                    frequency: "3x a day",
                    given: "",
                    medicationName: "",
                    purpose: "",
                    remarks: "",
                    route: "oral",
                    duration: "",
                    updatedAt: format(new Date(), "yyyy-MM-dd"),
                  };
                  setTableData((row) => {
                    if (row) {
                      return [...row, prescrption];
                    }
                    return [prescrption];
                  });
                  setUnitData((row) => {
                    if (row) {
                      return [...row, { dosage: "mg", duration: "day/s" }];
                    }
                    return [{ dosage: "mg", duration: "day/s" }];
                  });
                }}
              >
                Add Medication
              </Button>
            ) : (
              ""
            )}
          </div>
          <div className="flex w-full justify-between items-center">
            <div className="flex gap-3 items-center">
              <p className="whitespace-nowrap">{"Doctor's Remarks:"}</p>
              <Input
                className="w-96 h-8"
                disabled={user.usertype === "Pharmacist"}
                value={patient.comments}
                onChange={(e) =>
                  setPatient((old) => {
                    const newPatient: PatientDB = JSON.parse(
                      JSON.stringify(old)
                    );
                    newPatient.comments = e.target.value;
                    return newPatient;
                  })
                }
              />
            </div>
            {/* <p className="font-bold">
              CN-{patient.consultation?.consultationNumber}
            </p> */}
          </div>
          <div className="self-end justify-self-end flex justify-between w-full gap-1">
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
              {`Dr. ${
                user.usertype === "Doctor" && newPrescription
                  ? user.fullName
                  : `${staff?.firstName} ${staff?.lastName}`
              }`}
              <br />
              {staff?.license ? (
                <>
                  {staff?.license} <br />
                </>
              ) : (
                <Skeleton className="w-28 h-6" />
              )}
              {staff?.phone ? staff?.phone : "-"} <br />
              MSU-IIT Clinic
            </p>

            <div className="flex items-end gap-1 print:hidden">
              <Button onClick={() => router.back()} variant="link">
                BACK
              </Button>
              {user.usertype === "Doctor" || user.usertype === "Pharmacist" ? (
                <Button
                  onClick={async () => {
                    if (tableData?.length === 0) return;
                    for (const row of tableData) {
                      const empty =
                        row.purpose === "" &&
                        row.medicationName === "" &&
                        row.dispense === "";
                      if (empty) {
                        alert("There's a row with empty medication.");
                        return;
                      }
                    }
                    setButtonLoad(true);
                    let prescription: Prescription[] = JSON.parse(
                      JSON.stringify(tableData)
                    );
                    let unitTable: UnitData[] = JSON.parse(
                      JSON.stringify(unitData)
                    );

                    // delete empty rows
                    prescription = prescription.filter((e, i) => {
                      const empty =
                        e.purpose === "" &&
                        e.medicationName === "" &&
                        e.dispense === "";
                      if (empty) unitTable.splice(i, 1);
                      return !empty;
                    });
                    log(prescription, unitTable);

                    for (let i = 0; i < prescription.length; i++) {
                      prescription[i].dosage = `${
                        prescription[i].dosage.split(" ")[0]
                      } ${unitTable[i].dosage}`;
                      prescription[i].duration = `${
                        prescription[i].duration.split(" ")[0]
                      } ${unitTable[i].duration}`;
                      delete prescription[i].updatedAt;
                    }
                    log(prescription);
                    if (user.usertype === "Doctor") {
                      await axios.put(`/api/patient/${patient?.userID}`, {
                        ...patient,
                        prescription,
                        doctor: user._id,
                      });

                      await axios.delete(
                        `/api/queue?doctor=${patient.idNumber}`
                      );
                      await axios.post(
                        `/api/queue?pharmacist=${patient.idNumber}`
                      );
                      router.replace("/prescribe");
                    } else {
                      await axios.put(`/api/patient/${patient?.userID}`, {
                        ...patient,
                        prescription,
                        pharmacist:
                          user.usertype === "Pharmacist"
                            ? `${user.firstName} ${user.lastName}`
                            : "",
                      });

                      await axios.delete(
                        `/api/queue?pharmacist=${patient?.idNumber}`
                      );
                      router.replace("/dispense");
                    }
                  }}
                  disabled={buttonLoad}
                >
                  {buttonLoad ? <Loader2 className="animate-spin mr-2" /> : ""}
                  SAVE
                </Button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </main>
    );
  else return <></>;
}
