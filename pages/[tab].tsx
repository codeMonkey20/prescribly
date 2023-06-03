import React, { FormEvent, useState, useEffect } from "react";
import QRCode from "react-qr-code";
import Image from "next/image";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import axios from "axios";
import UserTable from "@/components/tables/UserTable";
import { UserDB } from "@/types/UserDB";
import { InputLabel } from "@/components/InputLabel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const { tab } = router.query;

  const [profileUpdateMode, setProfileUpdateMode] = useState(false);
  const [buttonLoad, setButtonLoad] = useState(false);
  const [tabLoad, setTabLoad] = useState(false);
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<UserDB[]>([]);

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

  const handleAddUser = async function (e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!(e.target instanceof HTMLFormElement)) return;
    setButtonLoad(true);
    const form = new FormData(e.target);
    const formJSON = Object.fromEntries(form.entries());
    const { data } = await axios.post("/api/user", formJSON);
    delete formJSON.email;
    await axios.post(`/api/staff/${data._id}`, formJSON);
    setButtonLoad(false);
    setOpen(false);
  };

  useEffect(() => {
    if (tab === "users") {
      setTabLoad(true);
      axios.get("/api/user/nonpatients").then(({ data }) => {
        setTabLoad(false);
        setUsers(data);
      });
    }
  }, [tab, buttonLoad]);

  if (session.status === "authenticated")
    return (
      <main className="flex justify-center items-center h-screen">
        <div className="w-11/12 h-5/6 border-4 border-primary bg-primary rounded-3xl flex">
          <div className="w-64 min-h-fit bg-white rounded-l-3xl flex flex-col">
            <div className="p-6 h-64 aspect-square">
              {usertype === "Patient" ? (
                <QRCode value={userData?.idNumber + ""} size={208} />
              ) : (
                <div className="w-[208px] h-[208px]" />
              )}
            </div>
            <header className="flex flex-col gap-1 grow pl-3 py-3 cursor-pointer">
              <Link
                href="/dashboard"
                className="font-semibold text-lg text-center py-2 rounded-l-3xl hover:bg-primary/40 transition-colors duration-200"
                style={{ backgroundColor: tab === "dashboard" ? "hsl(var(--primary))" : "" }}
                replace
              >
                Dashboard
              </Link>
              {usertype !== "Admin" ? (
                <Link
                  href="/profile"
                  className="font-semibold text-lg text-center py-2 rounded-l-3xl hover:bg-primary/40 transition-colors duration-200"
                  style={{ backgroundColor: tab === "profile" ? "hsl(var(--primary))" : "" }}
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
                  style={{ backgroundColor: tab === "users" ? "hsl(var(--primary))" : "" }}
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
                  style={{ backgroundColor: tab === "patients" ? "hsl(var(--primary))" : "" }}
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
                  style={{ backgroundColor: tab === "dispense" ? "hsl(var(--primary))" : "" }}
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
                  style={{ backgroundColor: tab === "prescribe" ? "hsl(var(--primary))" : "" }}
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
          </div>
          <div className="flex flex-col grow px-8 py-5">
            <h1 className="text-4xl font-bold my-8 ml-3">
              {!Array.isArray(tab) ? tab?.replace(/^\w/, (c) => c.toUpperCase()) : ""}
            </h1>
            {tab === "profile" ? (
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
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() => setProfileUpdateMode((state) => !state)}
                        >
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
            ) : (
              ""
            )}
            {tab === "users" ? (
              <div className="bg-white flex grow rounded-3xl px-4 py-2">
                <div className="w-full">
                  <div className="flex justify-between">
                    <h2 className="self-center font-semibold text-lg">Role Management</h2>
                    <Button onClick={() => setOpen(true)}>Add User</Button>
                    <Dialog open={open} onOpenChange={() => setOpen(false)}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add User</DialogTitle>
                          <DialogDescription>
                            {"Add user to your profile here. Click save when you're done."}
                          </DialogDescription>
                        </DialogHeader>
                        <form className="grid gap-4 py-4" onSubmit={handleAddUser}>
                          <div className="flex gap-2">
                            <InputLabel name="firstName" required>
                              First Name
                            </InputLabel>
                            <InputLabel name="lastName" required>
                              Last Name
                            </InputLabel>
                            <InputLabel name="middleInitial" className="w-14">
                              Initials
                            </InputLabel>
                          </div>
                          <div className="flex gap-2">
                            <InputLabel type="date" name="birthdate" required>
                              Date of Birth
                            </InputLabel>
                            <InputLabel name="phone">Phone</InputLabel>
                          </div>
                          <div className="flex gap-2">
                            <InputLabel name="address">Address</InputLabel>
                            <div>
                              <Label>Role</Label>
                              <Select name="usertype" defaultValue="Doctor">
                                <SelectTrigger>
                                  <div className="w-20">
                                    <SelectValue />
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Doctor">Doctor</SelectItem>
                                  <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <InputLabel type="email" name="email" required>
                              Email
                            </InputLabel>
                          </div>
                          <div className="flex gap-2">
                            <InputLabel type="password" name="password" required>
                              Password
                            </InputLabel>
                          </div>
                          <DialogFooter>
                            <Button type="submit" disabled={buttonLoad}>
                              {buttonLoad ? <Loader2 className="animate-spin mr-2" /> : ""}Save changes
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <UserTable users={users} loading={tabLoad} />
                </div>
              </div>
            ) : (
              ""
            )}
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
