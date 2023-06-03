import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDebouncedState from "@/hooks/useDebouncedState";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FormEvent, useEffect, useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { signIn } from "next-auth/react";

export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    return {
      redirect: {
        destination: `/profile`,
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

export default function Register() {
  const [buttonLoad, setButtonLoad] = useState(false);
  const [error, setError] = useState(false);
  const [email, setEmail] = useDebouncedState("", 600);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!(e.target instanceof HTMLFormElement)) return;
    setButtonLoad(true);
    const formData = new FormData(e.target);
    formData.append("usertype", "Patient");
    const formDataJSON = Object.fromEntries(formData.entries());
    const { data } = await axios.post("/api/user", formDataJSON);
    signIn("credentials", {
      email: formDataJSON.email,
      password: formDataJSON.password,
      callbackUrl: `/register/${data._id}`,
    });
  };

  useEffect(() => {
    if (email === "") return;
    axios.get(`/api/user?email=${email}`).then(({ data }) => {
      if (data.length === 0) setError(false);
      else setError(true);
    });
  }, [email]);

  return (
    <main className="flex h-screen">
      <div className="relative flex flex-col justify-center grow bg-white">
        <div>
          <div className="text-3xl my-16 text-center">Create an account</div>
          <form className="py-4 px-16 flex flex-col gap-5" onSubmit={handleSubmit}>
            <Input name="firstName" placeholder="First Name" required />
            <Input name="lastName" placeholder="Last Name" required />
            <div className="grid w-full items-center gap-1.5">
              <Input
                type="email"
                name="email"
                placeholder="Email"
                className={error ? "border-destructive" : ""}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error ? <p className="text-sm text-destructive">Email already exists.</p> : ""}
            </div>
            <Input type="password" name="password" placeholder="Password" required />
            <Button className="px-10 py-6 rounded-lg" disabled={buttonLoad || error}>
              {buttonLoad ? <Loader2 className="animate-spin mr-2" /> : ""}
              CREATE
            </Button>
          </form>
          <div className="text-center">
            {"Already have an account?"}{" "}
            <Link href="/login">
              <span className="italic underline">Login here!</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-3/5 bg-white">
        <div className="flex justify-center items-center h-full bg-primary rounded-l-3xl">
          <Image src="/logo.png" alt="logo" width={150} height={150} className="w-auto" priority />
          <div>
            <div className="font-semibold text-5xl">PRESCRIBLY</div>
            <div className="text-lg">Prescription made easy.</div>
          </div>
        </div>
      </div>
    </main>
  );
}
