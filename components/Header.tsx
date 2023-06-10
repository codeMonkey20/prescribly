import Link from "next/link";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import QRCode from "react-qr-code";
import Image from "next/image";

type Props = {};

export default function Header({}: Props) {
  const session = useSession();
  const usertype = session.data?.user.usertype;
  const userData = session.data?.user.usertypeData;
  const router = useRouter();
  const url = router.asPath;

  return (
    <>
      <div className="p-6 h-64 aspect-square flex items-center justify-center">
        {usertype === "Patient" ? (
          <QRCode value={userData?.idNumber + ""} size={208} />
        ) : (
          <Image src={"/logo.png"} width={150} height={150} alt="logo" />
        )}
      </div>
      <header className="flex flex-col gap-1 grow pl-3 py-3 cursor-pointer">
        <Link
          href="/dashboard"
          className="font-semibold text-lg text-center py-2 rounded-l-3xl hover:bg-primary/40 transition-colors duration-200"
          style={{ backgroundColor: url.includes("dashboard") ? "hsl(var(--primary))" : "" }}
          replace
        >
          Dashboard
        </Link>
        {usertype !== "Admin" ? (
          <Link
            href="/profile"
            className="font-semibold text-lg text-center py-2 rounded-l-3xl hover:bg-primary/40 transition-colors duration-200"
            style={{ backgroundColor: url.includes("profile") ? "hsl(var(--primary))" : "" }}
            replace
          >
            Profile
          </Link>
        ) : (
          ""
        )}
        {usertype === "Admin" ? (
          <Link
            href="/users"
            className="font-semibold text-lg text-center py-2 rounded-l-3xl hover:bg-primary/40 transition-colors duration-200"
            style={{ backgroundColor: url.includes("users") ? "hsl(var(--primary))" : "" }}
            replace
          >
            Users
          </Link>
        ) : (
          ""
        )}
        {usertype !== "Patient" ? (
          <Link
            href="/patients"
            className="font-semibold text-lg text-center py-2 rounded-l-3xl hover:bg-primary/40 transition-colors duration-200"
            style={{ backgroundColor: url.includes("patients") ? "hsl(var(--primary))" : "" }}
            replace
          >
            Patients
          </Link>
        ) : (
          ""
        )}
        {usertype === "Pharmacist" ? (
          <Link
            href="/dispense"
            className="font-semibold text-lg text-center py-2 rounded-l-3xl hover:bg-primary/40 transition-colors duration-200"
            style={{ backgroundColor: url.includes("dispense") ? "hsl(var(--primary))" : "" }}
            replace
          >
            Dispense
          </Link>
        ) : (
          ""
        )}
        {usertype === "Doctor" ? (
          <Link
            href="/prescribe"
            className="font-semibold text-lg text-center py-2 rounded-l-3xl hover:bg-primary/40 transition-colors duration-200"
            style={{ backgroundColor: url.includes("prescribe") ? "hsl(var(--primary))" : "" }}
            replace
          >
            Prescribe
          </Link>
        ) : (
          ""
        )}
        <Dialog>
          <DialogTrigger className="font-semibold text-lg text-center py-2 rounded-l-3xl hover:bg-primary/40 transition-colors duration-200">
            Logout
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Logout</DialogTitle>
              <DialogDescription>Are you sure to logout?</DialogDescription>
              <DialogFooter>
                <Button onClick={() => signOut({ callbackUrl: "/login" })}>Logout</Button>
              </DialogFooter>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </header>
    </>
  );
}
