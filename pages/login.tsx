import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import React, { FormEvent, useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import axios from "axios";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/router";

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);
  if (session && !session.user.usertypeID) {
    if (!session.user.usertypeID)
      return {
        redirect: {
          destination: `/register?id=${session.user._id}`,
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
  const router = useRouter();
  const [buttonLoad, setButtonLoad] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [show, setShow] = useState(false);
  const [toggleID, setToggleID] = useState(false);
  const [idNumber, setIdNumber] = useState("");
  const [exists, setExists] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setButtonLoad(true);
    if (!(e.target instanceof HTMLFormElement)) return;
    const formData = new FormData(e.target);
    const formDataJSON = Object.fromEntries(formData.entries());
    const inputEmail =
      typeof formDataJSON.email === "string" ? formDataJSON.email : "";
    const inputPassword =
      typeof formDataJSON.password === "string" ? formDataJSON.password : "";
    const { data } = await axios.get(
      `/api/user?email=${inputEmail}&withPassword=true`
    );
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

  useEffect(() => {
    axios.get(`/api/patient?idNumber=${idNumber}`).then(({ data }) => {
      setExists(data.length !== 0);
    });
  }, [idNumber]);

  return (
    <main className="flex h-screen">
      <div className="w-3/5 bg-white">
        <div className="flex justify-center items-center h-full bg-primary rounded-r-3xl">
          <Image
            src="/logo.png"
            alt="logo"
            width={150}
            height={150}
            className="w-auto"
            priority
          />
          <div>
            <div className="font-semibold text-5xl">PRESCRIBLY</div>
            <div className="text-lg">Prescription made easy.</div>
          </div>
        </div>
      </div>
      <div className="relative flex flex-col justify-center grow bg-white">
        <div>
          <div className="text-3xl my-16 text-center">Login your account</div>
          <form
            className="py-4 px-16 flex flex-col gap-5"
            onSubmit={handleSubmit}
          >
            {loginError ? (
              <p className="text-destructive font-thin">
                Incorrect Email or Password
              </p>
            ) : (
              ""
            )}
            <Input name="email" placeholder="Email" required />
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
              />
              {show ? (
                <EyeOffIcon
                  onClick={() => setShow((tog) => !tog)}
                  className="absolute w-10 right-2 top-2"
                />
              ) : (
                <EyeIcon
                  onClick={() => setShow((tog) => !tog)}
                  className="absolute w-10 right-2 top-2"
                />
              )}
            </div>
            <Button className="px-10 py-6 rounded-lg" disabled={buttonLoad}>
              {buttonLoad ? <Loader2 className="animate-spin mr-2" /> : ""}
              LOGIN
            </Button>
          </form>
          <div className="text-center flex flex-col items-center">
            <div>
              Already registered patient?{" "}
              <button
                className="italic underline"
                onClick={() => setToggleID((state) => !state)}
              >
                <span className="italic underline">Queue here!</span>
              </button>
            </div>
            {toggleID ? (
              <>
                <div className="flex gap-1">
                  <Input
                    className="w-fit"
                    placeholder="0000-0000"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                  />
                  <Button
                    disabled={!exists}
                    onClick={async () => {
                      const id = await axios.get(
                        `/api/patient?idNumber=${idNumber}`
                      );
                      router.push(
                        `/register?id=${id.data[0].userID}&edit=true`
                      );
                    }}
                  >
                    Sign in form
                  </Button>
                </div>

                {!exists && idNumber !== "" ?<div className="text-center">
                  Are you a new patient?{" "}
                  <Link href="/register">
                    <span className="italic underline">Register here!</span>
                  </Link>
                </div> : ""}
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
