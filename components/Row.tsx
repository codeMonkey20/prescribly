import truncate from "@/lib/truncate";
import { UserDB } from "@/types/UserDB";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsFillPersonFill } from "react-icons/bs";

type Props = {
  data: UserDB;
};

export default function Row({ data }: Props) {
  const [idNumber, setIdNumber] = useState("");
  const [healthConditions, setHealthConditions] = useState("");

  useEffect(() => {
    axios.get(`/api/patient/${data._id}`).then(({ data }) => {
      setIdNumber(data.idNumber);
      setHealthConditions(data.healthConditions);
    });
  }, [data._id]);

  if (idNumber !== "")
    return (
      <div className="flex justify-between cursor-pointer hover:bg-muted p-2 rounded">
        <div className="flex gap-2">
          <div className="w-fit h-fit rounded-full bg-muted/50 p-2 self-center">
            <BsFillPersonFill />
          </div>
          <div className="text-sm">
            <p className="font-bold">{`${data.firstName} ${data.lastName}`}</p>
            <p className="text-xs italic">{healthConditions ? truncate(healthConditions, 50) : "No Health Conditions"}</p>
          </div>
        </div>
        <Link href={`/prescription/${idNumber}/view`} className="self-center mr-2 hover:underline whitespace-nowrap">
          View Prescription
        </Link>
      </div>
    );
  return <></>;
}
