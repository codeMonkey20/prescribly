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
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
    axios.get(`/api/patient?search=${search}`).then(({ data }) => {
      // setLoading(false);
      setPatients(data);
    });
  }, [search, page.active]);

  if (session.status === "authenticated")
    return (
      <main className="flex justify-center items-center h-screen">
        <div className="w-11/12 max-h-[83.33%] h-[83.33%] border-4 border-primary bg-primary rounded-3xl flex">
          <div className="w-64 min-h-fit bg-white rounded-l-3xl flex flex-col">
            <Header />
          </div>
          <div className="flex flex-col grow px-8 py-5 h-full">
            <h1 className="text-4xl font-bold my-4 ml-3">Patients</h1>
            <div className="border max-h-[86%] h-full bg-white p-1 rounded-xl">
              <div className="w-full flex justify-end">
                <Input
                  className="w-80"
                  placeholder="Search Patients"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {/* <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-fit">Name</TableHead>
                    <TableHead className="w-fit">ID Number</TableHead>
                    <TableHead className="w-fit">College</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
              </Table> */}
              <div className="h-[85%]">
                <div className="max-h-full h-full overflow-y-auto">
                  <PatientsTable patients={patients} setPatients={setPatients} loading={loading} />
                </div>
              </div>
            </div>
            {/* <h1 className="text-4xl font-bold my-8 ml-3">Patients</h1>
            <div className="bg-white flex flex-col gap-2 items-center rounded-3xl px-4 py-2">
              <div className="self-end w-96">
                <Input placeholder="Search Patients" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="w-full h-full">
                <PatientsTable patients={patients} setPatients={setPatients} loading={loading} />
              </div>
              <div className="self-end select-none">
                <Button variant="secondary" className="mr-2" onClick={page.previous} disabled={page.active === 1}>
                  Prev
                </Button>
                <Button variant="secondary" onClick={page.next} disabled={page.active === Math.ceil(length / LIMIT)}>
                  Next
                </Button>
              </div>
            </div> */}
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
