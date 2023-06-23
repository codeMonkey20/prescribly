import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PatientDB } from "@/types/PatientDB";
import { Interventions } from "@/types/Interventions";
import { PlusIcon, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import log from "@/lib/log";

type Props = {
  patient: PatientDB;
  setPatient: React.Dispatch<React.SetStateAction<PatientDB | undefined>>;
};

export default function InterventionsTable({ patient, setPatient }: Props) {
  const session = useSession();
  const intervention = patient.consultation ? JSON.parse(JSON.stringify(patient.consultation.interventions)) : [];
  const [interventions, setInterventions] = useState<Interventions[]>(intervention);

  useEffect(() => {
    setPatient((old) => {
      return {
        ...old,
        consultation: {
          ...old?.consultation,
          interventions,
        },
      };
    });
  }, [interventions, setPatient]);

  return (
    <Table className="grow max-h-full">
      <TableHeader>
        <TableRow>
          <TableHead className="p-0 h-6">Description</TableHead>
          <TableHead className="p-0 h-6">Time</TableHead>
          <TableHead className="p-0 h-6">RN</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {interventions.map((e, i) => {
          return (
            <TableRow key={i}>
              <TableCell className="p-1">
                <Input
                  className="h-6"
                  value={e.description}
                  onChange={(input) => {
                    setInterventions((old) => {
                      const copy: Interventions[] = JSON.parse(JSON.stringify(old));
                      copy[i].description = input.target.value;
                      return copy;
                    });
                  }}
                />
              </TableCell>
              <TableCell className="p-0">{e.time ? format(new Date(e.time + ""), "hh:mmaa") : ""}</TableCell>
              <TableCell className="p-0">{e.nurseFullName}</TableCell>
              <TableCell className="p-0">
                <div
                  className="p-2 w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center"
                  onClick={() => {
                    setInterventions((old) => {
                      return old.filter((_, idx) => idx !== i);
                    });
                  }}
                >
                  <Trash2 className="w-5" />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
        <TableRow className="h-6 p-0">
          <TableCell className="p-0">
            <div
              className="w-fit flex items-center cursor-pointer select-none"
              onClick={() =>
                setInterventions((old) => {
                  return [
                    ...old,
                    {
                      description: "",
                      nurse: session.data?.user._id,
                      nurseFullName: `${session.data?.user.firstName} ${session.data?.user.lastName}`,
                      time: new Date().toString(),
                    },
                  ];
                })
              }
            >
              <PlusIcon className="w-4 h-4" /> Add Intervention
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
