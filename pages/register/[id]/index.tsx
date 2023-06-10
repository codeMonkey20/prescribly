import { InputLabel } from "@/components/InputLabel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { FormEvent, useEffect, useState } from "react";
import date from "date-and-time";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import Logo from "@/components/Logo";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { UserDB } from "@/types/UserDB";

export default function PatientRegister() {
  const skeletonSizes = [
    90, 64, 115, 73, 109, 54, 109, 90, 120, 120, 120, 96, 89, 57, 74, 103, 61, 115, 115, 90, 110, 65, 59, 65, 85, 58,
    83, 84, 70, 94, 98, 119, 71, 87, 66, 88,
  ];
  const { query, push } = useRouter();
  const [age, setAge] = useState(0);
  const [conditions, setConditions] = useState([]);
  const [buttonLoad, setButtonLoad] = useState(false);
  const [user, setUser] = useState<UserDB>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!(e.target instanceof HTMLFormElement)) return;
    setButtonLoad(true);
    const formData = new FormData(e.target);
    const formDataJSON = Object.fromEntries(formData.entries());
    const newFormDataJSON = {
      ...formDataJSON,
      smoke: formDataJSON.smoke === "yes",
      alcohol: formDataJSON.alcohol === "yes",
      healthConditions: "",
      prescriptions: [],
      fullName: `${formDataJSON.firstName} ${formDataJSON.lastName}`,
    };
    await axios.post(`/api/patient/${query.id}`, newFormDataJSON);
    push(`/register/${query.id}/qr`);
  };

  useEffect(() => {
    axios.get("/api/lists/medical-conditions").then(({ data }) => setConditions(data));
    if (query.id) axios.get(`/api/user/${query.id}`).then(({ data }) => setUser(data));
  }, [query.id]);

  return (
    <main className="flex justify-center items-center h-screen bg-white">
      <form className="w-11/12 h-5/6 border-4 border-primary rounded-3xl flex" onSubmit={handleSubmit}>
        <div className="w-2/5 px-6 flex flex-col justify-center gap-1">
          <h1 className="text-3xl font-bold">Register</h1>
          <p className="italic">Fill in the form with accurate information about you.</p>
          <h2 className="my-2 text-xl font-semibold">Patient Registration</h2>
          <div className="flex flex-col gap-3">
            <div className="flex gap-5">
              <InputLabel name="firstName" defaultValue={user.firstName} required>
                First Name
              </InputLabel>
              <InputLabel name="lastName" defaultValue={user.lastName} required>
                Last Name
              </InputLabel>
              <InputLabel name="middleInital" className="w-12">
                Initals
              </InputLabel>
            </div>
            <div className="flex gap-5">
              <InputLabel name="idNumber" placeholder="2018-2302" required>
                ID Number
              </InputLabel>
              <div className="grid grow items-center gap-1.5">
                <Label>College</Label>
                <Select name="college" defaultValue="College of Computer Studies">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="College of Computer Studies">College of Computer Studies</SelectItem>
                    <SelectItem value="College of Science and Mathematics">
                      College of Science and Mathematics
                    </SelectItem>
                    <SelectItem value="College of Engineering">College of Engineering</SelectItem>
                    <SelectItem value="College of Economics, Business & Accountancy">
                      College of Economics, Business & Accountancy
                    </SelectItem>
                    <SelectItem value="College of Health Sciences">College of Health Sciences</SelectItem>
                    <SelectItem value="College of Education">College of Education</SelectItem>
                    <SelectItem value="College of Arts and Social Sciences">
                      College of Arts and Social Sciences
                    </SelectItem>
                    <SelectItem value="Integrated Developmental School">Integrated Developmental School</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-5">
              <InputLabel name="phone">Phone</InputLabel>
              <InputLabel
                type="date"
                name="birthdate"
                onChange={(e) => {
                  const dob = new Date(e.target.value);
                  const ageDifMs = Date.now() - dob.getTime();
                  const ageDate = new Date(ageDifMs);
                  setAge(Math.abs(ageDate.getUTCFullYear() - 1970));
                }}
                required
              >
                Date of Birth
              </InputLabel>
              <InputLabel value={age} className="w-12" disabled>
                Age
              </InputLabel>
            </div>
            <div className="flex gap-5">
              <div className="grid grow items-center gap-1.5">
                <Label>Sex assigned at birth</Label>
                <Select name="gender" defaultValue="Male">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grow items-center gap-1.5">
                <Label>Civil Status</Label>
                <Select name="civilStatus" defaultValue="Single">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grow items-center gap-1.5">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" name="address" />
            </div>
          </div>
        </div>
        <div className="grow bg-primary rounded-r-2xl p-4">
          <div className="bg-white rounded-3xl px-5 py-3 h-full flex flex-col justify-center gap-2">
            <h2 className="text-xl font-semibold">Medical Information</h2>
            <div className="flex gap-4">
              <div className="flex flex-col gap-3">
                <div>
                  <Label>Smoke:</Label>
                  <RadioGroup name="smoke" className="flex" defaultValue="no">
                    <div className="flex items-center gap-1">
                      <RadioGroupItem id="smoke-yes" value="yes" />
                      <Label htmlFor="smoke-yes">Yes</Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <RadioGroupItem id="smoke-no" value="no" />
                      <Label htmlFor="smoke-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label>Liquor/Alcohol:</Label>
                  <RadioGroup name="alcohol" className="flex" defaultValue="no">
                    <div className="flex items-center gap-1">
                      <RadioGroupItem id="alcohol-yes" value="yes" />
                      <Label htmlFor="alcohol-yes">Yes</Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <RadioGroupItem id="alcohol-no" value="no" />
                      <Label htmlFor="alcohol-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div className="grid grow items-center gap-1.5">
                <Label htmlFor="allergies">Allergies:</Label>
                <Textarea id="allergies" name="allergies" />
              </div>
              <div className="grid grow items-center gap-1.5">
                <Label htmlFor="medications">Medication/s:</Label>
                <Textarea id="medications" name="medications" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Medical Condition/s:</h3>
              <div className="grid grid-cols-4">
                {conditions.map((condition: string, i: number) => (
                  <p key={`condition-${i}`} className="italic text-sm">
                    {condition}
                  </p>
                ))}
                {conditions.length === 0
                  ? skeletonSizes.map((e, i) => (
                      <Skeleton key={`skeleton-${i}`} className="h-3 my-1" style={{ width: e }} />
                    ))
                  : ""}
              </div>
              <h3 className="italic font-semibold">Enter your medical condition/s base on the given above.</h3>
              <Textarea name="medicalConditions" />
              <div className="self-end">
                <Button
                  variant="ghost"
                  type="button"
                  className="w-fit mr-2"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  Sign out
                </Button>
                <Button className="w-fit" disabled={buttonLoad}>
                  {buttonLoad ? <Loader2 className="animate-spin mr-2" /> : ""}PROCEED
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <Logo />
    </main>
  );
}
