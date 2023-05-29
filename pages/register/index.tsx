import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FormEvent } from "react";

export default function Register() {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!(e.target instanceof HTMLFormElement)) return;
    const formData = new FormData(e.target);
    formData.append("usertype", "Patient");
    const formDataJSON = Object.fromEntries(formData.entries());
    const { data } = await axios.post("/api/user", formDataJSON);
    router.push(`/register/${data._id}`);
  };

  return (
    <main className="flex h-screen">
      <div className="relative flex flex-col justify-center grow bg-white">
        <div>
          <div className="text-3xl my-16 text-center">Create an account</div>
          <form className="py-4 px-16 flex flex-col gap-5" onSubmit={handleSubmit}>
            <Input name="firstName" placeholder="First Name" required />
            <Input name="lastName" placeholder="Last Name" required />
            <Input type="email" name="email" placeholder="Email" required />
            <Input type="password" name="password" placeholder="Password" required />
            <Button className="px-10 py-6 rounded-lg">CREATE</Button>
          </form>
          <div className="text-center">
            {"Already have an account?"}{" "}
            <Link href="/login">
              <span className="italic underline">Login here!</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-3/5 bg-white">
        <div className="flex justify-center items-center h-full bg-background rounded-l-3xl">
          <Image src="/logo.png" alt="logo" width={150} height={150} className="w-auto" priority />
          <div>
            <div className="font-semibold text-5xl">PRESCRIBLY</div>
            <div className="text-lg">Prescription made easy.</div>
          </div>
        </div>
      </div>
    </main>
  );
}
