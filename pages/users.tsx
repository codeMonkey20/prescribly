import React, { FormEvent, useState, useEffect } from "react";
import Image from "next/image";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import axios from "axios";
import UserTable from "@/components/tables/UserTable";
import { UserDB } from "@/types/UserDB";
import { InputLabel } from "@/components/InputLabel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import usePagination from "@/hooks/usePagination";
import { useRouter } from "next/router";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import log from "@/lib/log";

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

export default function UsersPage() {
  const session = useSession();
  const router = useRouter();

  const [buttonLoad, setButtonLoad] = useState(false);
  const [tabLoad, setTabLoad] = useState(false);
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<UserDB[]>([]);
  const [search, setSearch] = useState("");
  const [length, setLength] = useState<number>(0);

  // const page = usePagination({ total: length });

  const handleAddUser = async function (e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!(e.target instanceof HTMLFormElement)) return;
    setButtonLoad(true);
    const form = new FormData(e.target);
    const formJSON = Object.fromEntries(form.entries());
    if (formJSON.middleInitial) {
      formJSON.fullName = `${formJSON.firstName} ${formJSON.middleInitial} ${formJSON.lastName}`;
    } else formJSON.fullName = `${formJSON.firstName} ${formJSON.lastName}`;
    formJSON.password = "1234";
    const { data } = await axios.post("/api/user", formJSON);
    delete formJSON.email;
    await axios.post(`/api/staff/${data._id}`, formJSON);
    setButtonLoad(false);
    setOpen(false);
    setUsers((oldUsers) => [...oldUsers, data]);
    // router.reload();
  };

  useEffect(() => {
    setTabLoad(true);
    axios.get("/api/user/staff?page=1").then(({ data }) => {
      setTabLoad(false);
      setUsers(data);
    });
  }, []);

  useEffect(() => {
    axios.get(`/api/user/staff?search=${search}`).then(({ data }) => setUsers(data));
    axios.get("/api/staff/count").then(({ data }) => setLength(data.count));
  }, [search]);
  log(users);

  if (session.status === "authenticated")
    return (
      <main className="flex justify-center items-center h-screen">
        <div className="w-11/12 h-5/6 border-4 border-primary bg-primary rounded-3xl flex">
          <div className="w-64 min-h-fit bg-white rounded-l-3xl flex flex-col">
            <Header />
          </div>
          <div className="flex flex-col grow px-8 py-5 max-h-full">
            <h1 className="text-4xl font-bold my-3 ml-3">Users</h1>
            <div className="bg-white grow rounded-3xl px-4 py-2 max-h-full">
              <div className="flex justify-between my-2">
                <Input
                  className="w-96"
                  placeholder="Search Staffs"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
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
                              <SelectItem value="Nurse">Nurse</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <InputLabel type="email" name="email" required>
                          Email
                        </InputLabel>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={buttonLoad}>
                          {buttonLoad ? <Loader2 className="animate-spin mr-2" /> : ""}Add User
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grow flex flex-col max-h-[80%] overflow-y-auto">
                <UserTable users={users} setUsers={setUsers} loading={tabLoad} />
                {/* <div className="self-end select-none">
                  <Button variant="secondary" className="mr-2" onClick={page.previous} disabled={page.active === 1}>
                    Prev
                  </Button>
                  <Button variant="secondary" onClick={page.next} disabled={page.active === Math.ceil(length / LIMIT)}>
                    Next
                  </Button>
                </div> */}
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
