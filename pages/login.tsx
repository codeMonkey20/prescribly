import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import axios from "axios";
import { Loader2 } from "lucide-react";

export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);
  if (session && !session.user.usertypeID) {
    if (!session.user.usertypeID)
      return {
        redirect: {
          destination: `/register/${session.user._id}`,
          permanent: false,
        },
      };
    else
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

export default function Login() {
  const [buttonLoad, setButtonLoad] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setButtonLoad(true);
    if (!(e.target instanceof HTMLFormElement)) return;
    const formData = new FormData(e.target);
    const formDataJSON = Object.fromEntries(formData.entries());
    const inputEmail = typeof formDataJSON.email === "string" ? formDataJSON.email : "";
    const inputPassword = typeof formDataJSON.password === "string" ? formDataJSON.password : "";
    const { data } = await axios.get(`/api/user?email=${inputEmail}&withPassword=true`);
    if (data.length === 0) {
      setLoginError(true);
      setButtonLoad(false);
      return;
    }

    const user = data[0];
    const hashCompareResponse = await axios.post("/api/utils/hashCompare", {
      content: inputPassword,
      hash: user.password,
    });
    const isPasswordMatch = hashCompareResponse.data.match;
    if (!isPasswordMatch) {
      setLoginError(true);
      setButtonLoad(false);
      return;
    }

    signIn("credentials", {
      email: inputEmail,
      password: inputPassword,
      callbackUrl: "/",
    });
    return;
  };

  return (
    <main className="flex h-screen">
      <div className="w-3/5 bg-white">
        <div className="flex justify-center items-center h-full bg-primary rounded-r-3xl">
          <Image src="/logo.png" alt="logo" width={150} height={150} className="w-auto" priority />
          <div>
            <div className="font-semibold text-5xl">PRESCRIBLY</div>
            <div className="text-lg">Prescription made easy.</div>
          </div>
        </div>
      </div>
      <div className="relative flex flex-col justify-center grow bg-white">
        <div>
          <div className="text-3xl my-16 text-center">Login your account</div>
          <form className="py-4 px-16 flex flex-col gap-5" onSubmit={handleSubmit}>
            {loginError ? <p className="text-destructive font-thin">Incorrect Email or Password</p> : ""}
            <Input name="email" placeholder="Email" required />
            <Input type="password" name="password" placeholder="Password" required />
            <Button className="px-10 py-6 rounded-lg" disabled={buttonLoad}>
              {buttonLoad ? <Loader2 className="animate-spin mr-2" /> : ""}
              LOGIN
            </Button>
          </form>
          <div className="text-center">
            {"Don't have an account yet?"}{" "}
            <Link href="/register">
              <span className="italic underline">Create here!</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
