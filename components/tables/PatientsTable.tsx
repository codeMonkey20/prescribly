import { PatientDB } from "@/types/PatientDB";
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { SlOptions } from "react-icons/sl";
import axios from "axios";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

type Props = {
  patients?: PatientDB[];
  loading?: boolean;
  setPatients: React.Dispatch<React.SetStateAction<PatientDB[]>>;
};

export default function PatientsTable({ patients, setPatients, loading }: Props) {
  const [buttonLoad, setButtonLoad] = useState(false);
  const session = useSession();

  if (!loading && patients)
    return (
      <div className="grow w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-fit">Name</TableHead>
              <TableHead>ID Number</TableHead>
              <TableHead>College</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient, i) => (
              <TableRow key={`patient-${i}`}>
                <TableCell className="font-medium">{`${patient.firstName} ${patient.lastName}`}</TableCell>
                <TableCell>{patient.idNumber}</TableCell>
                <TableCell>{patient.college}</TableCell>
                <TableCell className="text-right flex">
                  {patient.prescription?.length !== 0 && session.data?.user.usertype !== "Admin" ? (
                    <Link href={`/prescription/${patient.idNumber}/view`} className="self-center mr-2 hover:underline">
                      View Prescription
                    </Link>
                  ) : (
                    <p className="font-bold">{session.data?.user.usertype !== "Admin" ? "No Prescription Data" : ""}</p>
                  )}
                </TableCell>
                {session.data?.user.usertype === "Admin" ? (
                  <TableCell>
                    <Popover>
                      <PopoverTrigger>
                        <div className="rounded-full hover:bg-slate-300/50 w-fit p-2">
                          <SlOptions />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-fit p-2">
                        <Link
                          className="flex w-full text-sm pr-6 pl-1 py-1 rounded hover:bg-muted/80 cursor-pointer"
                          href={`/register?id=${patient.userID}&edit=true`}
                        >
                          Edit
                        </Link>
                        <Dialog>
                          <DialogTrigger className="w-full">
                            <div className="flex w-full text-sm pr-6 pl-1 py-1 rounded hover:bg-muted/80 cursor-pointer">
                              Delete
                            </div>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader className="font-bold text-lg">Delete Patient</DialogHeader>
                            <DialogDescription>You wish to delete patient?</DialogDescription>
                            <DialogFooter>
                              <Button
                                variant="destructive"
                                onClick={async () => {
                                  setButtonLoad(true);
                                  await axios.delete(`/api/patient/${patient.userID}`);
                                  setButtonLoad(false);
                                  setPatients((old) => {
                                    return old.filter((e) => e.userID !== patient.userID);
                                  });
                                }}
                                disabled={buttonLoad}
                              >
                                {buttonLoad ? <Loader2 className="animate-spin mr-1" /> : ""}DELETE
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Link
                          className="flex w-fit text-sm pr-6 pl-1 py-1 rounded hover:bg-muted/80 cursor-pointer"
                          href={`/qr/${patient.idNumber}`}
                        >
                          Show QR Code
                        </Link>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                ) : (
                  ""
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {patients.length === 0 ? (
          <div className="flex justify-center my-10 font-bold text-2xl text-slate-400/50">No Users</div>
        ) : (
          ""
        )}
      </div>
    );
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>ID Number</TableHead>
          <TableHead>College</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <TableRow key={`userrow-${i}`}>
              <TableCell className="font-medium">
                <Skeleton className="w-60 h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-60 h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-60 h-4" />
              </TableCell>
              <TableCell className="text-right"></TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
