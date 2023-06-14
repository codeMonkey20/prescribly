import InputSuggest from "@/components/InputSuggest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { MimsDB } from "@/types/MimsDB";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputLabel } from "@/components/InputLabel";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogClose } from "@radix-ui/react-dialog";

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

export default function MimsPage() {
  const router = useRouter();
  const session = useSession();

  const [mims, setMims] = useState<MimsDB[]>([]);

  if (session.status === "authenticated")
    return (
      <main className="flex justify-center items-center h-screen">
        <div className="w-11/12 h-5/6 border-4 border-primary bg-primary rounded-3xl flex">
          <div className="w-64 min-h-fit bg-white rounded-l-3xl flex flex-col">
            <Header />
          </div>
          <div className="flex flex-col grow px-8 py-5">
            <h1 className="text-4xl font-bold my-8 ml-3">MIMS</h1>
            <div className="bg-white flex flex-col gap-2 items-center grow rounded-3xl px-4 py-2">
              <div className="flex justify-between w-full">
                <Input placeholder="Search Medicine" className="w-80" />
                <Dialog>
                  <DialogTrigger>
                    <Button>Add Medicine</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Medicine</DialogTitle>
                      <DialogDescription>{"Add medicine here. Click save when you're done."}</DialogDescription>
                    </DialogHeader>
                    <form className="grid gap-4 py-4">
                      <div className="flex gap-2">
                        <InputLabel required>Medicine Name</InputLabel>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Dosage</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="h-60 overflow-y-auto">
                              <SelectItem value="" className="h-8"></SelectItem>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="Lf">Lf</SelectItem>
                              <SelectItem value="L">L</SelectItem>
                              <SelectItem value="uCi">uCi</SelectItem>
                              <SelectItem value="ug">ug</SelectItem>
                              <SelectItem value="umol">umol</SelectItem>
                              <SelectItem value="um">um</SelectItem>
                              <SelectItem value="mCi">mCi</SelectItem>
                              <SelectItem value="meq">meq</SelectItem>
                              <SelectItem value="mg">mg</SelectItem>
                              <SelectItem value="mL">mL</SelectItem>
                              <SelectItem value="mm">mm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Form</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="" className="h-8"></SelectItem>
                              <SelectItem value="M">M</SelectItem>
                              <SelectItem value="sol">sol</SelectItem>
                              <SelectItem value="syr">syr</SelectItem>
                              <SelectItem value="tab">tab</SelectItem>
                              <SelectItem value="caps">caps</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Route</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="h-60 overflow-y-auto">
                              <SelectItem value="" className="h-8"></SelectItem>
                              <SelectItem value="oral">oral</SelectItem>
                              <SelectItem value="sublingual">sublingual</SelectItem>
                              <SelectItem value="buccal">buccal</SelectItem>
                              <SelectItem value="intravenous">intravenous</SelectItem>
                              <SelectItem value="intramuscular">intramuscular</SelectItem>
                              <SelectItem value="subcutaneous">subcutaneous</SelectItem>
                              <SelectItem value="inhalation">inhalation</SelectItem>
                              <SelectItem value="nasal">nasal</SelectItem>
                              <SelectItem value="rectal">rectal</SelectItem>
                              <SelectItem value="vaginal">vaginal</SelectItem>
                              <SelectItem value="cutaneous">cutaneous</SelectItem>
                              <SelectItem value="otic">otic</SelectItem>
                              <SelectItem value="ocular">ocular</SelectItem>
                              <SelectItem value="transdermal">transdermal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Frequency</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="h-60 overflow-y-auto">
                              <SelectItem value="" className="h-8"></SelectItem>
                              <SelectItem value="b.i.d.">b.i.d.</SelectItem>
                              <SelectItem value="t.i.d.">t.i.d.</SelectItem>
                              <SelectItem value="q.i.d.">q.i.d.</SelectItem>
                              <SelectItem value="q.h.s.">q.h.s.</SelectItem>
                              <SelectItem value="5X a day">5X a day</SelectItem>
                              <SelectItem value="q.4h">q.4h</SelectItem>
                              <SelectItem value="q.6h">q.6h</SelectItem>
                              <SelectItem value="q.o.d.">q.o.d.</SelectItem>
                              <SelectItem value="prn.">prn.</SelectItem>
                              <SelectItem value="q.t.t.">q.t.t.</SelectItem>
                              <SelectItem value="a.c.">a.c.</SelectItem>
                              <SelectItem value="p.c.">p.c.</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose className="px-4 py-2 bg-foreground text-white rounded-lg">
                          Save changes
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <Table>
                <TableHeader className="border-b">
                  <TableHead className="border-r">Medicine Name</TableHead>
                  <TableHead className="border-r">Form</TableHead>
                  <TableHead className="border-r">Dosage</TableHead>
                  <TableHead className="border-r">Route</TableHead>
                  <TableHead>Frequency</TableHead>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>x</TableCell>
                    <TableCell>x</TableCell>
                    <TableCell>x</TableCell>
                    <TableCell>x</TableCell>
                    <TableCell>x</TableCell>
                    <TableCell className="flex gap-2 p-1">
                      <div className="rounded-full p-3 hover:bg-muted">
                        <Dialog>
                          <DialogTrigger>
                            <Edit2Icon size={18} />
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Medicine</DialogTitle>
                              <DialogDescription>
                                {"Edit medicine here. Click save when you're done."}
                              </DialogDescription>
                            </DialogHeader>
                            <form className="grid gap-4 py-4">
                              <div className="flex gap-2">
                                <InputLabel required>Medicine Name</InputLabel>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label>Dosage</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="h-60 overflow-y-auto">
                                      <SelectItem value="" className="h-8"></SelectItem>
                                      <SelectItem value="kg">kg</SelectItem>
                                      <SelectItem value="Lf">Lf</SelectItem>
                                      <SelectItem value="L">L</SelectItem>
                                      <SelectItem value="uCi">uCi</SelectItem>
                                      <SelectItem value="ug">ug</SelectItem>
                                      <SelectItem value="umol">umol</SelectItem>
                                      <SelectItem value="um">um</SelectItem>
                                      <SelectItem value="mCi">mCi</SelectItem>
                                      <SelectItem value="meq">meq</SelectItem>
                                      <SelectItem value="mg">mg</SelectItem>
                                      <SelectItem value="mL">mL</SelectItem>
                                      <SelectItem value="mm">mm</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Form</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="" className="h-8"></SelectItem>
                                      <SelectItem value="M">M</SelectItem>
                                      <SelectItem value="sol">sol</SelectItem>
                                      <SelectItem value="syr">syr</SelectItem>
                                      <SelectItem value="tab">tab</SelectItem>
                                      <SelectItem value="caps">caps</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Route</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="h-60 overflow-y-auto">
                                      <SelectItem value="" className="h-8"></SelectItem>
                                      <SelectItem value="oral">oral</SelectItem>
                                      <SelectItem value="sublingual">sublingual</SelectItem>
                                      <SelectItem value="buccal">buccal</SelectItem>
                                      <SelectItem value="intravenous">intravenous</SelectItem>
                                      <SelectItem value="intramuscular">intramuscular</SelectItem>
                                      <SelectItem value="subcutaneous">subcutaneous</SelectItem>
                                      <SelectItem value="inhalation">inhalation</SelectItem>
                                      <SelectItem value="nasal">nasal</SelectItem>
                                      <SelectItem value="rectal">rectal</SelectItem>
                                      <SelectItem value="vaginal">vaginal</SelectItem>
                                      <SelectItem value="cutaneous">cutaneous</SelectItem>
                                      <SelectItem value="otic">otic</SelectItem>
                                      <SelectItem value="ocular">ocular</SelectItem>
                                      <SelectItem value="transdermal">transdermal</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Frequency</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="h-60 overflow-y-auto">
                                      <SelectItem value="" className="h-8"></SelectItem>
                                      <SelectItem value="b.i.d.">b.i.d.</SelectItem>
                                      <SelectItem value="t.i.d.">t.i.d.</SelectItem>
                                      <SelectItem value="q.i.d.">q.i.d.</SelectItem>
                                      <SelectItem value="q.h.s.">q.h.s.</SelectItem>
                                      <SelectItem value="5X a day">5X a day</SelectItem>
                                      <SelectItem value="q.4h">q.4h</SelectItem>
                                      <SelectItem value="q.6h">q.6h</SelectItem>
                                      <SelectItem value="q.o.d.">q.o.d.</SelectItem>
                                      <SelectItem value="prn.">prn.</SelectItem>
                                      <SelectItem value="q.t.t.">q.t.t.</SelectItem>
                                      <SelectItem value="a.c.">a.c.</SelectItem>
                                      <SelectItem value="p.c.">p.c.</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <DialogClose className="px-4 py-2 bg-foreground text-white rounded-lg">
                                  Save changes
                                </DialogClose>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="rounded-full p-3 hover:bg-muted">
                        <Trash2Icon size={18} />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
