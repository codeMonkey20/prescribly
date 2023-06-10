import React, { FormEvent, useState } from "react";
import Image from "next/image";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import axios from "axios";
import Header from "@/components/Header";

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
        destination: `/register/${session.user._id}`,
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

  if (session.status === "authenticated")
    return (
      <main className="flex justify-center items-center h-screen">
        <div className="w-11/12 h-5/6 border-4 border-primary bg-primary rounded-3xl flex">
          <div className="w-64 min-h-fit bg-white rounded-l-3xl flex flex-col">
            <Header />
          </div>
          <div className="flex flex-col grow px-8 py-5">
            <h1 className="text-4xl font-bold my-8 ml-3">Profile</h1>
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
