import InputSuggest from "@/components/InputSuggest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useRef, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import usePagination from "@/hooks/usePagination";

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

export default function MimsPage() {
  const router = useRouter();
  const session = useSession();

  const [mims, setMims] = useState<MimsDB[]>([]);
  const [type, setType] = useState("medicine");
  const [length, setLength] = useState(0);
  const [search, setSearch] = useState("");
  const page = usePagination({ total: length });
  const addMedicineForm = useRef<HTMLFormElement>(null);
  const editMedicineForm = useRef<HTMLFormElement>(null);
  const addDosageForm = useRef<HTMLFormElement>(null);
  const editDosageForm = useRef<HTMLFormElement>(null);
  const addFormForm = useRef<HTMLFormElement>(null);
  const editFormForm = useRef<HTMLFormElement>(null);
  const addFreqForm = useRef<HTMLFormElement>(null);
  const editFreqForm = useRef<HTMLFormElement>(null);

  const handleAdd = async () => {
    const formElem =
      type === "medicine"
        ? addMedicineForm.current
        : type === "dosage"
        ? addDosageForm.current
        : type === "form"
        ? addFormForm.current
        : addFreqForm.current;
    if (!(formElem instanceof HTMLFormElement)) return;
    const formData = new FormData(formElem);
    const formJSON = Object.fromEntries(formData.entries());
    formJSON.type = "medicine";
    const { data } = await axios.post("/api/mims", formJSON);
    setMims((old) => [data, ...old]);
  };

  const handleEdit = async () => {
    const formElem =
      type === "medicine"
        ? editMedicineForm.current
        : type === "dosage"
        ? editDosageForm.current
        : type === "form"
        ? editFormForm.current
        : editFreqForm.current;
    if (!(formElem instanceof HTMLFormElement)) return;
    const formData = new FormData(formElem);
    const { id, ...formJSON } = Object.fromEntries(formData.entries());
    await axios.put(`/api/mims/${id}`, formJSON);
    router.reload();
  };

  useEffect(() => {
    axios.get("/api/mims?type=medicine").then(({ data }) => setMims(data));
    axios.get("/api/mims/count?type=medicine").then(({ data }) => setLength(data.count));
  }, []);

  useEffect(() => {
    axios.get(`/api/mims?type=${type}&search=${search}&page=${page.active}`).then(({ data }) => setMims(data));
    axios.get(`/api/mims/count?type=${type}`).then(({ data }) => setLength(data.count));
  }, [type, search, page.active]);

  if (session.status === "authenticated")
    return (
      <main className="flex justify-center items-center h-screen">
        <div className="w-11/12 h-5/6 border-4 border-primary bg-primary rounded-3xl flex">
          <div className="w-64 min-h-fit bg-white rounded-l-3xl flex flex-col">
            <Header />
          </div>
          <div className="flex flex-col grow px-8 py-5">
            <h1 className="text-4xl font-bold my-8 ml-3">MIMS</h1>
            <div className="bg-white grow rounded-3xl p-4">
              <div className="relative flex flex-col gap-2 items-center">
                <Tabs
                  defaultValue="medicine"
                  className="self-start"
                  onValueChange={(type) => {
                    page.first();
                    setType(type);
                  }}
                >
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="medicine">Medicine</TabsTrigger>
                    <TabsTrigger value="dosage">Dosage</TabsTrigger>
                    <TabsTrigger value="form">Form</TabsTrigger>
                    <TabsTrigger value="frequency">Frequency</TabsTrigger>
                  </TabsList>
                  <TabsContent value="medicine" className="absolute w-full">
                    <div className="flex justify-between w-full mb-3">
                      <Input
                        placeholder="Search Medicine"
                        className="w-80"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <Dialog>
                        <DialogTrigger>
                          <Button>Add Medicine</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Medicine</DialogTitle>
                            <DialogDescription>{"Add medicine here. Click save when you're done."}</DialogDescription>
                          </DialogHeader>
                          <form
                            ref={addMedicineForm}
                            className="grid gap-4 py-4"
                            onSubmit={(e) => {
                              console.log(e);
                            }}
                          >
                            <div className="flex gap-2">
                              <InputLabel name="name" required>
                                Medicine Name
                              </InputLabel>
                            </div>
                            <DialogFooter>
                              <DialogClose
                                onClick={handleAdd}
                                className="px-4 py-2 bg-foreground text-white rounded-lg"
                              >
                                ADD
                              </DialogClose>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Table>
                      <TableHeader className="border-b">
                        <TableHead className="border-r">Medicine Name</TableHead>
                        <TableHead className="w-20"></TableHead>
                      </TableHeader>
                      <TableBody>
                        {mims.map((e, i) => (
                          <TableRow key={`mims-${i}`}>
                            <TableCell>{e.name}</TableCell>
                            <TableCell className="flex gap-2 p-1 w-fit">
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
                                    <form ref={editMedicineForm} className="grid gap-4 py-4">
                                      <input type="hidden" name="id" value={e._id} />
                                      <div className="flex gap-2">
                                        <InputLabel name="name" defaultValue={e.name ? e.name : ""} required>
                                          Medicine Name
                                        </InputLabel>
                                      </div>
                                      <DialogFooter>
                                        <DialogClose
                                          onClick={handleEdit}
                                          className="px-4 py-2 bg-foreground text-white rounded-lg"
                                        >
                                          Save changes
                                        </DialogClose>
                                      </DialogFooter>
                                    </form>
                                  </DialogContent>
                                </Dialog>
                              </div>
                              <div className="rounded-full p-3 hover:bg-muted">
                                <Dialog>
                                  <DialogTrigger>
                                    <Trash2Icon size={18} />
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Delete Medicine</DialogTitle>
                                      <DialogDescription>{"Are you sure to delete this medicine?"}</DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <DialogClose
                                        onClick={() =>
                                          axios
                                            .delete(`/api/mims/${e._id}`)
                                            .then(() => setMims((old) => old.filter((meds) => meds._id !== e._id)))
                                        }
                                        className="px-4 py-2 bg-destructive text-white rounded-lg"
                                      >
                                        DELETE
                                      </DialogClose>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="dosage" className="absolute w-full">
                    <div className="flex justify-between w-full mb-3">
                      <Input
                        placeholder="Search Dosage"
                        className="w-80"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <Dialog>
                        <DialogTrigger>
                          <Button>Add Dosage</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Dosage</DialogTitle>
                            <DialogDescription>{"Add dosage here. Click save when you're done."}</DialogDescription>
                          </DialogHeader>
                          <form ref={addDosageForm} className="grid gap-4 py-4">
                            <div className="flex gap-2">
                              <InputLabel name="name" required>
                                Dosage Name
                              </InputLabel>
                            </div>
                            <DialogFooter>
                              <DialogClose
                                onClick={handleAdd}
                                className="px-4 py-2 bg-foreground text-white rounded-lg"
                              >
                                ADD
                              </DialogClose>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Table>
                      <TableHeader className="border-b">
                        <TableHead className="border-r">Dosage Name</TableHead>
                        <TableHead className="w-20"></TableHead>
                      </TableHeader>
                      <TableBody>
                        {mims.map((e, i) => (
                          <TableRow key={`mims-${i}`}>
                            <TableCell>{e.name}</TableCell>
                            <TableCell className="flex gap-2 p-1 w-fit">
                              <div className="rounded-full p-3 hover:bg-muted">
                                <Dialog>
                                  <DialogTrigger>
                                    <Edit2Icon size={18} />
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Dosage</DialogTitle>
                                      <DialogDescription>
                                        {"Edit dosage here. Click save when you're done."}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <form ref={editDosageForm} className="grid gap-4 py-4">
                                      <input type="hidden" name="id" value={e._id} />
                                      <div className="flex gap-2">
                                        <InputLabel name="name" defaultValue={e.name ? e.name : ""} required>
                                          Dosage Name
                                        </InputLabel>
                                      </div>
                                      <DialogFooter>
                                        <DialogClose
                                          onClick={handleEdit}
                                          className="px-4 py-2 bg-foreground text-white rounded-lg"
                                        >
                                          Save changes
                                        </DialogClose>
                                      </DialogFooter>
                                    </form>
                                  </DialogContent>
                                </Dialog>
                              </div>
                              <div className="rounded-full p-3 hover:bg-muted">
                                <Dialog>
                                  <DialogTrigger>
                                    <Trash2Icon size={18} />
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Delete Dosage</DialogTitle>
                                      <DialogDescription>{"Are you sure to delete this dosage?"}</DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <DialogClose
                                        onClick={() =>
                                          axios
                                            .delete(`/api/mims/${e._id}`)
                                            .then(() => setMims((old) => old.filter((meds) => meds._id !== e._id)))
                                        }
                                        className="px-4 py-2 bg-destructive text-white rounded-lg"
                                      >
                                        DELETE
                                      </DialogClose>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="form" className="absolute w-full">
                    <div className="flex justify-between w-full mb-3">
                      <Input
                        placeholder="Search Form"
                        className="w-80"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <Dialog>
                        <DialogTrigger>
                          <Button>Add Form</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Form</DialogTitle>
                            <DialogDescription>{"Add form here. Click save when you're done."}</DialogDescription>
                          </DialogHeader>
                          <form ref={addFormForm} className="grid gap-4 py-4">
                            <div className="flex gap-2">
                              <InputLabel name="name" required>
                                Form Name
                              </InputLabel>
                            </div>
                            <DialogFooter>
                              <DialogClose
                                onClick={handleAdd}
                                className="px-4 py-2 bg-foreground text-white rounded-lg"
                              >
                                ADD
                              </DialogClose>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Table>
                      <TableHeader className="border-b">
                        <TableHead className="border-r">Form Name</TableHead>
                        <TableHead className="w-20"></TableHead>
                      </TableHeader>
                      <TableBody>
                        {mims.map((e, i) => (
                          <TableRow key={`mims-${i}`}>
                            <TableCell>{e.name}</TableCell>
                            <TableCell className="flex gap-2 p-1 w-fit">
                              <div className="rounded-full p-3 hover:bg-muted">
                                <Dialog>
                                  <DialogTrigger>
                                    <Edit2Icon size={18} />
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Form</DialogTitle>
                                      <DialogDescription>
                                        {"Edit form here. Click save when you're done."}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <form ref={editFormForm} className="grid gap-4 py-4">
                                      <input type="hidden" name="id" value={e._id} />
                                      <div className="flex gap-2">
                                        <InputLabel name="name" defaultValue={e.name ? e.name : ""} required>
                                          Form Name
                                        </InputLabel>
                                      </div>
                                      <DialogFooter>
                                        <DialogClose
                                          onClick={handleEdit}
                                          className="px-4 py-2 bg-foreground text-white rounded-lg"
                                        >
                                          Save changes
                                        </DialogClose>
                                      </DialogFooter>
                                    </form>
                                  </DialogContent>
                                </Dialog>
                              </div>
                              <div className="rounded-full p-3 hover:bg-muted">
                                <Dialog>
                                  <DialogTrigger>
                                    <Trash2Icon size={18} />
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Delete Form</DialogTitle>
                                      <DialogDescription>{"Are you sure to delete this form?"}</DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <DialogClose
                                        onClick={() =>
                                          axios
                                            .delete(`/api/mims/${e._id}`)
                                            .then(() => setMims((old) => old.filter((meds) => meds._id !== e._id)))
                                        }
                                        className="px-4 py-2 bg-destructive text-white rounded-lg"
                                      >
                                        DELETE
                                      </DialogClose>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="frequency" className="absolute w-full">
                    <div className="flex justify-between w-full mb-3">
                      <Input
                        placeholder="Search Frequency"
                        className="w-80"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <Dialog>
                        <DialogTrigger>
                          <Button>Add Frequency</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Frequency</DialogTitle>
                            <DialogDescription>{"Add frequency here. Click save when you're done."}</DialogDescription>
                          </DialogHeader>
                          <form ref={addFreqForm} className="grid gap-4 py-4">
                            <div className="flex gap-2">
                              <InputLabel name="name" required>
                                Frequency Name
                              </InputLabel>
                            </div>
                            <DialogFooter>
                              <DialogClose
                                onClick={handleAdd}
                                className="px-4 py-2 bg-foreground text-white rounded-lg"
                              >
                                ADD
                              </DialogClose>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Table>
                      <TableHeader className="border-b">
                        <TableHead className="border-r">Frequency Name</TableHead>
                        <TableHead className="w-20"></TableHead>
                      </TableHeader>
                      <TableBody>
                        {mims.map((e, i) => (
                          <TableRow key={`mims-${i}`}>
                            <TableCell>{e.name}</TableCell>
                            <TableCell className="flex gap-2 p-1 w-fit">
                              <div className="rounded-full p-3 hover:bg-muted">
                                <Dialog>
                                  <DialogTrigger>
                                    <Edit2Icon size={18} />
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Frequency</DialogTitle>
                                      <DialogDescription>
                                        {"Edit frequency here. Click save when you're done."}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <form ref={editFreqForm} className="grid gap-4 py-4">
                                      <input type="hidden" name="id" value={e._id} />
                                      <div className="flex gap-2">
                                        <InputLabel defaultValue={e.name ? e.name : ""} required>
                                          Frequency Name
                                        </InputLabel>
                                      </div>
                                      <DialogFooter>
                                        <DialogClose
                                          onClick={handleEdit}
                                          className="px-4 py-2 bg-foreground text-white rounded-lg"
                                        >
                                          Save changes
                                        </DialogClose>
                                      </DialogFooter>
                                    </form>
                                  </DialogContent>
                                </Dialog>
                              </div>
                              <div className="rounded-full p-3 hover:bg-muted">
                                <Dialog>
                                  <DialogTrigger>
                                    <Trash2Icon size={18} />
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Delete Frequency</DialogTitle>
                                      <DialogDescription>{"Are you sure to delete this frequency?"}</DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <DialogClose
                                        onClick={() =>
                                          axios
                                            .delete(`/api/mims/${e._id}`)
                                            .then(() => setMims((old) => old.filter((meds) => meds._id !== e._id)))
                                        }
                                        className="px-4 py-2 bg-destructive text-white rounded-lg"
                                      >
                                        DELETE
                                      </DialogClose>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>

                <div className="absolute right-0 select-none">
                  <Button variant="secondary" className="mr-2" onClick={page.previous} disabled={page.active === 1}>
                    Prev
                  </Button>
                  <Button variant="secondary" onClick={page.next} disabled={page.active === Math.ceil(length / LIMIT)}>
                    Next
                  </Button>
                </div>
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
