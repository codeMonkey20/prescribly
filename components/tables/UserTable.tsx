import React, { useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserDB } from "@/types/UserDB";
import { Skeleton } from "@/components/ui/skeleton";
import { SlOptions } from "react-icons/sl";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { InputLabel } from "../InputLabel";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { StaffDB } from "@/types/StaffDB";
import { format } from "date-fns";

type Props = {
  users: UserDB[];
  setUsers: React.Dispatch<React.SetStateAction<UserDB[]>>;
  loading?: boolean;
};

export default function UserTable({ users, setUsers, loading }: Props) {
  const form = useRef<HTMLFormElement>(null);
  const staffs = useRef<StaffDB[]>([]);
  const [staffLoad, setStaffLoad] = useState(true);

  const handleEditUser = async () => {
    const formElem = form.current;
    if (!(formElem instanceof HTMLFormElement)) return;
    const formData = new FormData(formElem);
    const formJSON = Object.fromEntries(formData.entries());
    console.log(formJSON);
    const { email, firstName, lastName, usertype, ...request } = formJSON;
    await axios.put(`/api/user/${formJSON.userID}`, { email, firstName, lastName, usertype });
    await axios.put(`/api/staff/${formJSON.userID}`, { firstName, lastName, ...request });
    const newUsers = await axios.get("/api/user/staff");
    setUsers(newUsers.data);
  };

  useEffect(() => {
    axios.get("/api/staff").then(({ data }) => {
      setStaffLoad(false);
      staffs.current = data;
    });
  }, []);

  if (!loading && !staffLoad)
    return (
      <div className="grow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const staff = staffs.current.filter((e) => e.userID === user._id)[0];
              return (
                <TableRow key={user._id}>
                  <TableCell className="font-medium py-2">{user.email}</TableCell>
                  <TableCell className="py-2">{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell className="py-2">{user.usertype}</TableCell>
                  <TableCell className="text-right w-10 py-2">
                    <Popover>
                      <PopoverTrigger>
                        <div className="rounded-full hover:bg-slate-300/50 w-fit p-2">
                          <SlOptions />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-fit p-1 flex flex-col gap-1 cursor-pointer">
                        <Dialog>
                          <DialogTrigger>
                            <div className="flex w-full text-sm pr-6 pl-1 py-1 hover:bg-muted/80">Edit</div>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit User</DialogTitle>
                              <DialogDescription>
                                {"Edit user to your profile here. Click save when you're done."}
                              </DialogDescription>
                            </DialogHeader>
                            <form className="grid gap-4 py-4" ref={form}>
                              <input type="hidden" name="userID" value={user._id} />
                              <div className="flex gap-2">
                                <InputLabel name="firstName" defaultValue={user.firstName} required>
                                  First Name
                                </InputLabel>
                                <InputLabel name="lastName" defaultValue={user.lastName} required>
                                  Last Name
                                </InputLabel>
                                <InputLabel name="middleInitial" className="w-14" defaultValue={staff.middleInitial}>
                                  Initials
                                </InputLabel>
                              </div>
                              <div className="flex gap-2">
                                <InputLabel
                                  type="date"
                                  name="birthdate"
                                  defaultValue={format(new Date(staff.birthdate), "yyyy-MM-dd")}
                                  required
                                >
                                  Date of Birth
                                </InputLabel>
                                <InputLabel name="phone" defaultValue={staff.phone}>
                                  Phone
                                </InputLabel>
                              </div>
                              <div className="flex gap-2">
                                <InputLabel name="address" defaultValue={staff.address}>
                                  Address
                                </InputLabel>
                                <div>
                                  <Label>Role</Label>
                                  <Select name="usertype" defaultValue={user.usertype}>
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
                                <InputLabel type="email" name="email" defaultValue={user.email} required>
                                  Email
                                </InputLabel>
                              </div>
                              <DialogFooter>
                                <DialogClose
                                  onClick={handleEditUser}
                                  className="px-4 py-2 bg-foreground text-white rounded-lg"
                                >
                                  Save changes
                                </DialogClose>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger>
                            <div className="flex w-full text-sm pr-6 pl-1 py-1 hover:bg-muted/80">Delete</div>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader className="font-bold">Delete Permanently</DialogHeader>Are you sure to delete
                            this user?
                            <DialogFooter>
                              <DialogClose
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/80 rounded px-3 py-2"
                                onClick={() => {
                                  axios.delete(`/api/staff/${user._id}`).then(() => {
                                    setUsers((oldUsers) => {
                                      return oldUsers.filter((e) => e._id !== user._id);
                                    });
                                  });
                                }}
                              >
                                DELETE
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {users.length === 0 ? (
          <div className="flex justify-center my-10 font-bold text-2xl text-slate-400/50">No Users</div>
        ) : (
          ""
        )}
      </div>
    );
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array(3)
          .fill(0)
          .map((e, i) => (
            <TableRow key={`userrow-${i}`}>
              <TableCell className="font-medium">
                <Skeleton className="w-60 h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-60 h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-60 h-4" />
              </TableCell>
              <TableCell className="text-right"></TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
