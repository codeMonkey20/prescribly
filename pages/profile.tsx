import React, { FormEvent, useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

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

export default function LandingPage() {
  const session = useSession();
  const user = session.data?.user;
  const usertype = session.data?.user.usertype;
  const userData = session.data?.user.usertypeData;
  const router = useRouter();

  const [profileUpdateMode, setProfileUpdateMode] = useState(false);
  const [buttonLoad, setButtonLoad] = useState(false);
  const [password, setPassword] = useState("");
  const [invalidPass, setInvalidPass] = useState(false);
  const [sign, setSign] = useState("");

  const handleProfileUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!(e.target instanceof HTMLFormElement)) return;
    setButtonLoad(true);
    const form = new FormData(e.target);
    const { signature, terms, ...formJSON } = Object.fromEntries(form.entries());
    const boolterms = terms === "on";

    if (formJSON.password !== formJSON.repassword) {
      alert("Password does not match");
      setButtonLoad(false);
      return;
    }

    if (user?.usertype === "Doctor") {
      const reader = new FileReader();
      reader.onload = async function () {
        const data = reader.result?.toString().replace("data:", "").replace(/^.+,/, "");
        setSign(data + "");
        await axios.post(`/api/upload/${user?._id}`, { file: data });
      };
      const file: any = signature;
      reader.readAsDataURL(file);
    }

    delete formJSON.repassword;
    const userID = user?._id;
    await axios.put("/api/profile", { ...formJSON, usertype, userID, terms: boolterms });
    router.reload();
  };

  useEffect(() => {
    if (password === "" || password === undefined) setInvalidPass(false);
    else {
      const passwordregex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
      setInvalidPass(!passwordregex.test(password));
    }
  }, [password]);

  useEffect(() => {
    if (user && user.usertype !== "Admin")
      axios.get(`/api/staff/${user?._id}`).then(({ data }) => setSign(data.signature));
  }, [user]);

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
              {usertype !== "Admin" ? (
                <>
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
                          <span>
                            {userData?.birthdate ? format(new Date(userData?.birthdate), "MMM dd, yyyy") : ""}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col m-2 grow">
                        <Label className="italic text-md" htmlFor="phone">
                          Phone Number
                        </Label>
                        {profileUpdateMode ? (
                          <Input name="phone" id="phone" defaultValue={userData?.phone} />
                        ) : (
                          <span>{userData?.phone ? userData.phone : "-"}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col m-2 grow">
                        <Label className="italic text-md" htmlFor="license">
                          License Number
                        </Label>
                        {profileUpdateMode ? (
                          <Input name="license" id="license" defaultValue={userData?.license} required />
                        ) : (
                          <span>{userData?.license ? userData?.license : "-"}</span>
                        )}
                      </div>
                      <div className="flex flex-col m-2 grow">
                        <Label className="italic text-md" htmlFor="expire">
                          Expiry Date
                        </Label>
                        {profileUpdateMode ? (
                          <Input
                            type="date"
                            name="expire"
                            id="expire"
                            defaultValue={userData?.expire ? format(new Date(userData?.expire + ""), "yyyy-MM-dd") : ""}
                            required
                          />
                        ) : (
                          <span>{userData?.expire ? format(new Date(userData?.expire + ""), "yyyy-MM-dd") : "-"}</span>
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
                          <span>{userData?.address ? userData?.address : "-"}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Separator orientation="vertical" className="mx-4 h-auto my-2" />
                </>
              ) : (
                ""
              )}
              <div className="w-full flex flex-col">
                <h2 className="text-xl font-semibold my-6 mx-2">Account Information</h2>
                <div className="flex flex-col grow">
                  {usertype === "Doctor" ? (
                    <div className="flex justify-between">
                      <div className="flex flex-col m-2 grow">
                        <Label className="italic text-md" htmlFor="signature">
                          Signature
                        </Label>
                        {profileUpdateMode ? (
                          <Input name="signature" id="signature" type="file" required />
                        ) : sign !== "" || sign ? (
                          <Image src={"data:image/png;base64," + sign} alt="sign" width={80} height={80} />
                        ) : (
                          <Skeleton className="w-20 h-20 rounded-full" />
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="flex justify-between">
                    <div className="flex flex-col m-2 grow">
                      <Label className="italic text-md" htmlFor="email">
                        Email
                      </Label>
                      {profileUpdateMode ? (
                        <Input
                          name="email"
                          id="email"
                          defaultValue={user?.email}
                          disabled={usertype === "Admin"}
                          required
                        />
                      ) : (
                        <span>{user?.email}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col m-2 grow">
                      {profileUpdateMode ? (
                        <>
                          <div className="flex gap-2">
                            <div className="grow">
                              <Label className="italic text-md" htmlFor="password">
                                Password
                              </Label>
                              <Input
                                type="password"
                                name="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={invalidPass ? "border border-destructive" : ""}
                                required
                              />
                              {invalidPass ? (
                                <p className="text-xs italic text-destructive">
                                  Must contain at least 8 characters with special characters and 1 uppercase letter
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="grow">
                              <Label className="italic text-md" htmlFor="repassword">
                                Retype Password
                              </Label>
                              <Input type="password" name="repassword" id="repassword" required />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-5">
                            <Checkbox name="terms" />
                            <Label>
                              I am a certified licensed professional and agree to the{" "}
                              <Link
                                href="/DISCLOSURE-AGREEMENT.pdf"
                                target="_blank"
                                className="italic underline text-sm"
                              >
                                Terms and Conditions of Privacy Policy
                              </Link>
                            </Label>
                          </div>
                        </>
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
                      <Button disabled={buttonLoad || invalidPass}>
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
