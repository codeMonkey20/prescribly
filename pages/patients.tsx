import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import axios from "axios";
import PatientsTable from "@/components/tables/PatientsTable";
import { PatientDB } from "@/types/PatientDB";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import usePagination from "@/hooks/usePagination";

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
  }
  return {
    props: {},
  };
}

const LIMIT = 4;

export default function PatientsPage() {
  const session = useSession();

  const [patients, setPatients] = useState<PatientDB[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [length, setLength] = useState<number>(0);

  const page = usePagination({ total: length });

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/patient?search=&page=${1}`).then(({ data }) => {
      setLoading(false);
      setPatients(data);
    });
    axios.get("/api/patient/count").then(({ data }) => setLength(data.count));
  }, []);

  useEffect(() => {
    // setLoading(true);
    axios.get(`/api/patient?search=${search}&page=${page.active}`).then(({ data }) => {
      // setLoading(false);
      setPatients(data);
    });
  }, [search, page.active]);

  if (session.status === "authenticated")
    return (
      <main className="flex justify-center items-center h-screen">
        <div className="w-11/12 h-5/6 border-4 border-primary bg-primary rounded-3xl flex">
          <div className="w-64 min-h-fit bg-white rounded-l-3xl flex flex-col">
            <Header />
          </div>
          <div className="flex flex-col grow px-8 py-5">
            <h1 className="text-4xl font-bold my-8 ml-3">Patients</h1>
            <div className="bg-white flex flex-col gap-2 items-center grow rounded-3xl px-4 py-2">
              <div className="self-end w-96">
                <Input placeholder="Search Patients" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <PatientsTable patients={patients} setPatients={setPatients} loading={loading} />
              <div className="self-end select-none">
                <Button variant="secondary" className="mr-2" onClick={page.previous} disabled={page.active === 1}>
                  Prev
                </Button>
                <Button variant="secondary" onClick={page.next} disabled={page.active === Math.ceil(length / LIMIT)}>
                  Next
                </Button>
              </div>
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
