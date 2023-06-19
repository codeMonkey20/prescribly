import React, { useEffect, useState } from "react";
import Image from "next/image";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BsFillPeopleFill, BsFillPersonLinesFill, BsPrescription } from "react-icons/bs";
import { Calendar } from "@/components/ui/calendar";
import Row from "@/components/Row";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { UserDB } from "@/types/UserDB";

export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: `/login`,
        permanent: false,
      },
    };
  } else if (!session.user.usertypeID && session.user.usertype !== "Admin") {
    return {
      redirect: {
        destination: `/register?id=${session.user._id}`,
        permanent: false,
      },
    };
  } else if (!session.user.verified) {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

export default function DashboardPage() {
  const session = useSession();
  const [patientCount, setPatientCount] = useState<number>();
  const [prescriptionCountToday, setPrescriptionCountToday] = useState<number>();
  const [prescriptionCount, setPrescriptionCount] = useState<number>();
  const [recentPrescriptions, setRecentPrescriptions] = useState<UserDB[]>([]);

  useEffect(() => {
    axios.get("/api/patient/count").then(({ data }) => setPatientCount(data.count));
    axios.get("/api/patient/prescriptions/count?today=true").then(({ data }) => setPrescriptionCountToday(data.count));
    axios.get("/api/patient/prescriptions/count").then(({ data }) => setPrescriptionCount(data.count));
    axios.get("/api/patient/prescriptions?today=true").then(({ data }) => setRecentPrescriptions(data));
  }, []);

  if (session.status === "authenticated")
    return (
      <main className="flex justify-center items-center h-screen">
        <div className="w-11/12 h-5/6 border-4 border-primary bg-primary rounded-3xl flex">
          <div className="w-64 min-h-fit bg-white rounded-l-3xl flex flex-col">
            <Header />
          </div>
          <div className="flex flex-col grow gap-4 justify-evenly px-8 py-5">
            <h1 className="text-4xl font-bold ml-3">Welcome to Prescribly</h1>
            <div className="grid gap-3 grid-cols-3">
              <Card className="p-4 flex gap-3 bg-[#E9D364] text-white">
                <div className="w-10 grid items-center justify-center">
                  <BsFillPeopleFill className="text-4xl" />
                </div>
                <div>
                  <div className="font-semibold">Total Patients</div>
                  <div className="font-bold text-3xl">
                    {patientCount !== undefined ? patientCount : <Skeleton className="w-full h-8" />}
                  </div>
                </div>
              </Card>
              <Card className="p-4 flex gap-3 bg-[#69B744] text-white">
                <div className="w-10 grid items-center justify-center">
                  <BsFillPersonLinesFill className="text-4xl" />
                </div>
                <div>
                  <div className="font-semibold">Total Prescriptions Today</div>
                  <div className="font-bold text-3xl">
                    {prescriptionCountToday !== undefined ? (
                      prescriptionCountToday
                    ) : (
                      <Skeleton className="w-full h-8" />
                    )}
                  </div>
                </div>
              </Card>
              <Card className="p-4 flex gap-3 bg-foreground text-white">
                <div className="w-10 grid items-center justify-center">
                  <BsPrescription className="text-4xl" />
                </div>
                <div>
                  <div className="font-semibold">Total Prescriptions</div>
                  <div className="font-bold text-3xl">
                    {prescriptionCount !== undefined ? prescriptionCount : <Skeleton className="w-full h-8" />}
                  </div>
                </div>
              </Card>
            </div>
            <div className="flex gap-3">
              <Card className="w-fit">
                <Calendar />
              </Card>
              <Card className="grow">
                <CardHeader className="font-bold text-lg">
                  Recent Prescriptions
                  <p className="text-gray-400 text-sm font-normal">
                    Doctors made {prescriptionCountToday} prescription(s) this day.
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {recentPrescriptions.map((e, i) => (
                    <Row key={i} data={e} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    );
  return (
    <main className="flex items-center justify-center h-screen">
      <div className="flex flex-col justify-center items-center gap-3">
        <Image src="/logo.png" alt="logo" width={150} height={150} className="w-auto animate-pulse" priority />
      </div>
    </main>
  );
}
