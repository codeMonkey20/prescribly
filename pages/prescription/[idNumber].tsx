import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

type UnitData = {
  dosage: string;
  form: string;
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
  const newprescquery = router.query.new;
  const newPrescription = newprescquery === "true";

  useEffect(() => {
    if (router.query.idNumber) {
      axios.get(`/api/patient?idNumber=${router.query.idNumber}`).then(({ data }) => {
        setPatient(data[0]);
        if (!newPrescription) {
          setTableData(data[0]?.prescription);
          if (data[0]?.prescription) {
            setUnitData(
              data[0]?.prescription.map((e: Prescription) => {
                e.dosage;
                return {
                  dosage: e.dosage.split(" ")[1],
                  form: e.form.split(" ")[1],
                };
              })
            );
          }
        }
      });
    }
  }, [newPrescription, router, user?.usertype]);

  useEffect(() => {
    if (session.data && session.data.user) {
      axios
        .get(
          `/api/staff/${
            session.data.user.usertype === "Pharmacist" && patient?.doctor ? patient?.doctor : session.data.user._id
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
          <div className="flex justify-between">
            <FaPrescription className="text-5xl" />
            {user.usertype === "Doctor" && newPrescription ? (
              <Button
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
                  setUnitData((row) => {
                    if (row) {
                      return [...row, { dosage: "mg", form: "M" }];
                    }
                    return [{ dosage: "mg", form: "M" }];
                  });
                }}
              >
                Add Row
              </Button>
            ) : (
              ""
            )}
          </div>
          <div className="grow">
            <Table className="max-h-96 overflow-y-auto">
              <TableHeader>
                <TableRow>
                  {user.usertype === "Doctor" && newPrescription ? <TableHead></TableHead> : ""}
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
                    {user.usertype === "Doctor" && newPrescription ? (
                      <TableCell className="p-1">
                        <div
                          className="p-2 rounded-full hover:bg-muted"
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
                            const copy: Prescription[] = JSON.parse(JSON.stringify(old));
                            copy[i].purpose = input.target.value;
                            return copy;
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell className="p-1 border-r">
                      <Input
                        value={e.medicationName}
                        disabled={user.usertype === "Pharmacist"}
                        onChange={(input) => {
                          setTableData((old) => {
                            const copy: Prescription[] = JSON.parse(JSON.stringify(old));
                            copy[i].medicationName = input.target.value;
                            return copy;
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell className="p-1 flex items-center gap-2 border-r">
                      <Input
                        value={!newPrescription ? e.dosage.split(" ")[0] : e.dosage}
                        disabled={user.usertype === "Pharmacist"}
                        onChange={(input) => {
                          setTableData((old) => {
                            const copy: Prescription[] = JSON.parse(JSON.stringify(old));
                            copy[i].dosage = input.target.value;
                            return copy;
                          });
                        }}
                      />
                      <Select
                        defaultValue={!newPrescription ? e.dosage.split(" ")[1] : "mg"}
                        disabled={user.usertype === "Pharmacist"}
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
                        <SelectContent className="h-60 overflow-y-auto">
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="Lf">Lf</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="uCi">uCi</SelectItem>
                          <SelectItem value="ug">ug</SelectItem>
                          <SelectItem value="umol">umol</SelectItem>
                          <SelectItem value="um">um</SelectItem>
                          <SelectItem value="mCi">mCi</SelectItem>
                          <SelectItem value="meq">meq</SelectItem>
                          <SelectItem value="mg">mg</SelectItem>
                          <SelectItem value="mL">mL</SelectItem>
                          <SelectItem value="mm">mm</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-1 border-r">
                      <div className="flex items-center gap-2">
                        <Input
                          value={!newPrescription ? e.form.split(" ")[0] : e.form}
                          disabled={user.usertype === "Pharmacist"}
                          onChange={(input) => {
                            setTableData((old) => {
                              const copy = JSON.parse(JSON.stringify(old));
                              copy[i].form = input.target.value;
                              return copy;
                            });
                          }}
                        />
                        <Select
                          defaultValue={!newPrescription ? e.form.split(" ")[1] : "M"}
                          disabled={user.usertype === "Pharmacist"}
                          onValueChange={(input) => {
                            setUnitData((old) => {
                              old[i].form = input;
                              return old;
                            });
                          }}
                        >
                          <SelectTrigger>
                            <div className="w-fit">
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">M</SelectItem>
                            <SelectItem value="sol">sol</SelectItem>
                            <SelectItem value="syr">syr</SelectItem>
                            <SelectItem value="tab">tab</SelectItem>
                            <SelectItem value="caps">caps</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className="p-1 border-r">
                      {/* <Input
                        value={e.route}
                        disabled={user.usertype === "Pharmacist"}
                        onChange={(input) => {
                          setTableData((old) => {
                            const copy: Prescription[] = JSON.parse(JSON.stringify(old));
                            copy[i].route = input.target.value;
                            return copy;
                          });
                        }}
                      /> */}
                      <Select
                        defaultValue={!newPrescription ? e.route : "oral"}
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
                          <SelectItem value="intravenous">intravenous</SelectItem>
                          <SelectItem value="intramuscular">intramuscular</SelectItem>
                          <SelectItem value="subcutaneous">subcutaneous</SelectItem>
                          <SelectItem value="inhalation">inhalation</SelectItem>
                          <SelectItem value="nasal">nasal</SelectItem>
                          <SelectItem value="rectal">rectal</SelectItem>
                          <SelectItem value="vaginal">vaginal</SelectItem>
                          <SelectItem value="cutaneous">cutaneous</SelectItem>
                          <SelectItem value="otic">otic</SelectItem>
                          <SelectItem value="ocular">ocular</SelectItem>
                          <SelectItem value="transdermal">transdermal</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-1 border-r">
                      {/* <Input
                        value={e.frequency}
                        disabled={user.usertype === "Pharmacist"}
                        onChange={(input) => {
                          setTableData((old) => {
                            const copy: Prescription[] = JSON.parse(JSON.stringify(old));
                            copy[i].frequency = input.target.value;
                            return copy;
                          });
                        }}
                      /> */}
                      <Select
                        defaultValue={!newPrescription? e.frequency : "b.i.d."}
                        disabled={user.usertype === "Pharmacist"}
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
                          <SelectItem value="b.i.d.">b.i.d.</SelectItem>
                          <SelectItem value="t.i.d.">t.i.d.</SelectItem>
                          <SelectItem value="q.i.d.">q.i.d.</SelectItem>
                          <SelectItem value="q.h.s.">q.h.s.</SelectItem>
                          <SelectItem value="5X a day">5X a day</SelectItem>
                          <SelectItem value="q.4h">q.4h</SelectItem>
                          <SelectItem value="q.6h">q.6h</SelectItem>
                          <SelectItem value="q.o.d.">q.o.d.</SelectItem>
                          <SelectItem value="prn.">prn.</SelectItem>
                          <SelectItem value="q.t.t.">q.t.t.</SelectItem>
                          <SelectItem value="a.c.">a.c.</SelectItem>
                          <SelectItem value="p.c.">p.c.</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-1 border-r">
                      <Input
                        value={e.dispense}
                        disabled={user.usertype === "Pharmacist"}
                        onChange={(input) => {
                          setTableData((old) => {
                            const copy: Prescription[] = JSON.parse(JSON.stringify(old));
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
                            const copy: Prescription[] = JSON.parse(JSON.stringify(old));
                            copy[i].given = input.target.value;
                            return copy;
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        value={e.remarks}
                        disabled={user.usertype === "Doctor"}
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
          <div className="self-end justify-self-end flex justify-between w-full gap-1">
            <p className="font-bold">
              {`Dr. ${user.usertype === "Doctor" && newPrescription ? user.fullName : `${staff?.firstName} ${staff?.lastName}`}`} <br />
              {staff?.license ? staff?.license : "00-XXXXX-00"} <br />
              {staff?.phone ? staff?.phone : "N/A"} <br />
              MSU-IIT Clinic
            </p>

            <div className="flex items-end gap-1 print:hidden">
              <Button onClick={() => router.back()} variant="link">
                BACK
              </Button>
              {!newPrescription ? (
                <Button onClick={() => window.print()} className="bg-[#DA812E] hover:bg-[#DA812E]/80">
                  PRINT
                </Button>
              ) : (
                ""
              )}
              {user.usertype === "Doctor" || user.usertype === "Pharmacist" ? (
                <Button
                  onClick={async () => {
                    if (tableData?.length === 0) return;
                    setButtonLoad(true);
                    const prescription: Prescription[] = JSON.parse(JSON.stringify(tableData));
                    for (let i = 0; i < tableData.length; i++) {
                      prescription[i].dosage = `${prescription[i].dosage.split(" ")[0]} ${unitData[i].dosage}`;
                      prescription[i].form = `${prescription[i].form.split(" ")[0]} ${unitData[i].form}`;
                    }
                    console.log(prescription);
                    if (user.usertype === "Doctor") {
                      await axios.put(`/api/patient/${patient?.userID}`, {
                        ...patient,
                        prescription,
                        doctor: user._id,
                      });
                    } else {
                      await axios.put(`/api/patient/${patient?.userID}`, { ...patient, prescription });
                    }
                    router.replace("/patients");
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
