import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserDB } from "@/types/UserDB";
import { Skeleton } from "@/components/ui/skeleton";
import { SlOptions } from "react-icons/sl";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type Props = {
  users: UserDB[];
  loading?: boolean;
};

export default function UserTable({ users, loading }: Props) {
  if (!loading)
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
            {users.map((user) => (
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
                      <Button variant="ghost">
                        <div className="flex w-full">Edit</div>
                      </Button>
                      <Button variant="ghost">
                        <div className="flex w-full">Delete</div>
                      </Button>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
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
