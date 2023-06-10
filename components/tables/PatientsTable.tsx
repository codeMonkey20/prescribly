import { PatientDB } from "@/types/PatientDB";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { SlOptions } from "react-icons/sl";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type Props = {
  patients?: PatientDB[];
  loading?: boolean;
};

export default function PatientsTable({ patients, loading }: Props) {
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
                <TableCell className="text-right w-10 flex">
                  <Popover>
                    <PopoverTrigger>
                      <div className="rounded-full hover:bg-slate-300/50 w-fit p-2">
                        <SlOptions />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit p-1 flex flex-col gap-1 cursor-pointer">
                      <Button variant="ghost">
                        <div className="flex w-full">Edit</div>
                      </Button>
                      <Button variant="ghost">
                        <div className="flex w-full">Delete</div>
                      </Button>
                    </PopoverContent>
                  </Popover>
                </TableCell>
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
