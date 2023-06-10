import Link from "next/link";
import React from "react";
import { BsFillPersonFill } from "react-icons/bs";

type Props = {
  email?: string;
  fullName?: string;
  userID?: string;
};

export default function Row({ email, fullName, userID }: Props) {
  return (
    <div className="flex justify-between cursor-pointer hover:bg-muted p-2 rounded">
      <div className="flex gap-2">
        <div className="w-fit h-fit rounded-full bg-muted/50 p-2 self-center">
          <BsFillPersonFill />
        </div>
        <div className="text-sm">
          <p className="font-bold">{fullName}</p>
          <p className="text-xs">{email}</p>
        </div>
      </div>
      <Link href={`/`} className="self-center mr-2 hover:underline">
        View Prescription
      </Link>
    </div>
  );
}
