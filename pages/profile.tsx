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

export default function LandingPage() {
  const session = useSession();
  const user = session.data?.user;
  const usertype = session.data?.user.usertype;
  const userData = session.data?.user.usertypeData;
  const router = useRouter();

  const [profileUpdateMode, setProfileUpdateMode] = useState(false);
  const [buttonLoad, setButtonLoad] = useState(false);

  const handleProfileUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!(e.target instanceof HTMLFormElement)) return;
    setButtonLoad(true);
    const form = new FormData(e.target);
    const formJSON = Object.fromEntries(form.entries());
    if (formJSON.password !== formJSON.repassword) {
      alert("Password does not match");
      setButtonLoad(false);
      return;
    }
    delete formJSON.repassword;
    const userID = user?._id;
    await axios.put("/api/profile", { ...formJSON, usertype, userID });
    router.reload();
  };

  if (session.status === "authenticated")
    return (
      <main className="flex justify-center items-center h-screen">
        <div className="w-11/12 h-5/6 border-4 border-primary bg-primary rounded-3xl flex">
          <div className="w-64 min-h-fit bg-white rounded-l-3xl flex flex-col">
            <Header />
          </div>
          <div className="flex flex-col grow px-8 py-5">
            <h1 className="text-4xl font-bold my-8 ml-3">Profile</h1>
            <form className="bg-white flex grow rounded-3xl px-4 py-2" onSubmit={handleProfileUpdate}>
              <div className="flex flex-col w-full">
                <h2 className="text-xl font-semibold my-6 mx-2">Personal Information</h2>
                <div className="flex justify-between">
                  <div className="flex flex-col m-2 grow">
                    <Label className="italic text-md" htmlFor="firstName">
                      First Name
                    </Label>
                    {profileUpdateMode ? (
                      <Input name="firstName" id="firstName" defaultValue={userData?.firstName} required />
                    ) : (
                      <span>{userData?.firstName}</span>
                    )}
                  </div>
                  <div className="flex flex-col m-2 grow">
                    <Label className="italic text-md" htmlFor="lastName">
                      Last Name
                    </Label>
                    {profileUpdateMode ? (
                      <Input name="lastName" id="lastName" defaultValue={userData?.lastName} required />
                    ) : (
                      <span>{userData?.lastName}</span>
                    )}
                  </div>
                  <div className="flex flex-col m-2 w-16">
                    <Label className="italic text-md" htmlFor="middleInitial">
                      Initials
                    </Label>
                    {profileUpdateMode ? (
                      <Input name="middleInitial" id="middleInitial" defaultValue={userData?.middleInitial} />
                    ) : (
                      <span>{userData?.middleInitial ? userData?.middleInitial : "-"}</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col m-2 grow">
                    <Label className="italic text-md" htmlFor="birthdate">
                      Date of Birth
                    </Label>
                    {profileUpdateMode ? (
                      <Input
                        type="date"
                        name="birthdate"
                        id="birthdate"
                        defaultValue={format(new Date(userData?.birthdate + ""), "yyyy-MM-dd")}
                        required
                      />
                    ) : (
                      <span>{userData?.birthdate ? format(new Date(userData?.birthdate), "MMM dd, yyyy") : ""}</span>
                    )}
                  </div>
                  <div className="flex flex-col m-2 grow">
                    <Label className="italic text-md" htmlFor="phone">
                      Phone Number
                    </Label>
                    {profileUpdateMode ? (
                      <Input name="phone" id="phone" defaultValue={userData?.phone} />
                    ) : (
                      <span>{userData?.phone}</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col m-2 grow">
                    <Label className="italic text-md" htmlFor="address">
                      Address
                    </Label>
                    {profileUpdateMode ? (
                      <Textarea name="address" id="address" defaultValue={userData?.address} />
                    ) : (
                      <span>{userData?.address}</span>
                    )}
                  </div>
                </div>
              </div>
              <Separator orientation="vertical" className="mx-4 h-auto my-2" />
              <div className="w-full flex flex-col">
                <h2 className="text-xl font-semibold my-6 mx-2">Account Information</h2>
                <div className="flex flex-col grow">
                  <div className="flex justify-between">
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="email">
                        Email
                      </Label>
                      {profileUpdateMode ? (
                        <Input name="email" id="email" defaultValue={user?.email} required />
                      ) : (
                        <span>{user?.email}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col m-2 grow">
                      {profileUpdateMode ? (
                        <div className="flex gap-2">
                          <div className="grow">
                            <Label className="italic text-md" htmlFor="password">
                              Password
                            </Label>
                            <Input type="password" name="password" id="password" required />
                          </div>
                          <div className="grow">
                            <Label className="italic text-md" htmlFor="repassword">
                              Retype Password
                            </Label>
                            <Input type="password" name="repassword" id="repassword" required />
                          </div>
                        </div>
                      ) : (
                        <>
                          <Label className="italic text-md">Password</Label>
                          <span>*************</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="self-end flex gap-1">
                  {profileUpdateMode ? (
                    <>
                      <Button variant="secondary" type="button" onClick={() => setProfileUpdateMode((state) => !state)}>
                        CANCEL
                      </Button>
                      <Button disabled={buttonLoad}>
                        {buttonLoad ? <Loader2 className="animate-spin w-4 h-4 mr-1" /> : ""} SAVE
                      </Button>
                    </>
                  ) : (
                    <Button type="button" onClick={() => setProfileUpdateMode((state) => !state)}>
                      UPDATE
                    </Button>
                  )}
                </div>
              </div>
            </form>
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
