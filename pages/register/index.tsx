import { InputLabel } from "@/components/InputLabel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { FormEvent, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import Logo from "@/components/Logo";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import { UserDB } from "@/types/UserDB";
import { PatientDB } from "@/types/PatientDB";
import { format } from "date-fns";
import ageDate from "@/lib/ageDate";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import log from "@/lib/log";

export default function PatientRegister() {
  const skeletonSizes = [
    90, 64, 115, 73, 109, 54, 109, 90, 120, 120, 120, 96, 89, 57, 74, 103, 61,
    115, 115, 90, 110, 65, 59, 65, 85, 58, 83, 84, 70, 94, 98, 119, 71, 87, 66,
    88,
  ];
  const { query, push, back } = useRouter();
  const [age, setAge] = useState(0);
  const [conditions, setConditions] = useState([]);
  const [buttonLoad, setButtonLoad] = useState(false);
  const [user, setUser] = useState<UserDB>({});
  const [patient, setPatient] = useState<PatientDB>({});
  const editMode = query.edit === "true";
  const [loading, setLoading] = useState(true);
  const [isFemale, setIsFemale] = useState(false);
  const verifyMode = query.verify === "true";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!(e.target instanceof HTMLFormElement)) return;
    setButtonLoad(true);
    const formData = new FormData(e.target);
    const formDataJSON = Object.fromEntries(formData.entries());
    const currentMedications = formDataJSON.currentMedications;
    const electronicHealthRecord = {
      temperature: formDataJSON.temperature,
      pulse: formDataJSON.pulse,
      respiration: formDataJSON.respiration,
      bloodPressure: formDataJSON.bloodPressure,
      weight: formDataJSON.weight,
      oxygen: formDataJSON.oxygen,
    };
    delete formDataJSON.currentMedications;
    delete formDataJSON.temperature;
    delete formDataJSON.pulse;
    delete formDataJSON.respiration;
    delete formDataJSON.bloodPressure;
    delete formDataJSON.weight;
    delete formDataJSON.oxygen;
    // let medicalConditions = "";
    // for (const form in formDataJSON) {
    //   if (formDataJSON[form] === "on") {
    //     medicalConditions = `${medicalConditions}, ${form}`;
    //     delete formDataJSON[form];
    //   }
    // }
    // medicalConditions = medicalConditions.substring(2);
    if (editMode && query.id) {
      await axios.put(`/api/patient/${query.id}`, {
        ...formDataJSON,
        electronicHealthRecord,
        consultation: {
          currentMedications,
        },
        // medicalConditions,
      });
      if (verifyMode) push(`/examine/${patient.idNumber}/verify`);
      else {
        if (editMode) {
          await axios.post(`/api/queue?nurse=${patient.idNumber}`);
        } else {
          await axios.post(`/api/queue?nurse=${formDataJSON.idNumber}`);
        }
        push(`/done`);
      }
    } else {
      const newFormDataJSON = {
        ...formDataJSON,
        smoke: formDataJSON.smoke === "yes",
        alcohol: formDataJSON.alcohol === "yes",
        healthConditions: "",
        prescriptions: [],
        fullName: `${formDataJSON.firstName} ${formDataJSON.lastName}`,
        electronicHealthRecord,
        consultation: {
          currentMedications,
        },
        // medicalConditions,
      };
      const { firstName, lastName } = formDataJSON;
      const user = await axios.post(`/api/user`, {
        fullName: `${formDataJSON.firstName} ${formDataJSON.lastName}`,
        firstName,
        lastName,
        usertype: "Patient",
      });
      await axios.post(`/api/patient/${user.data._id}`, newFormDataJSON);
      if (editMode) {
        await axios.post(`/api/queue?nurse=${patient.idNumber}`);
      } else {
        await axios.post(`/api/queue?nurse=${formDataJSON.idNumber}`);
      }
      push(`/done`);
    }
  };

  useEffect(() => {
    axios.get("/api/lists/medical-conditions").then(({ data }) => {
      setConditions(data);
      setLoading(false);
    });
    if (query.id)
      axios.get(`/api/user/${query.id}`).then(({ data }) => {
        setUser(data);
        setLoading(false);
      });
    if (editMode && query.id)
      axios.get(`/api/patient/${query.id}`).then(({ data }) => {
        setPatient(data);
        setIsFemale(data.gender === "Female");
        setLoading(false);
        setAge(ageDate(data.birthdate));
      });
  }, [query.id, editMode]);

  if (!loading)
    return (
      <main className="flex justify-center items-center h-screen bg-white">
        <form
          className="w-11/12 h-5/6 border-4 border-primary rounded-3xl flex"
          onSubmit={handleSubmit}
        >
          <div className="w-2/5 px-6 flex flex-col justify-center gap-1">
            <h1 className="text-3xl font-bold">Register</h1>
            <p className="italic">
              Fill in the form with accurate information about you.
            </p>
            <h2 className="my-2 text-xl font-semibold">Patient Registration</h2>
            <div className="flex flex-col gap-3">
              <div className="flex gap-5">
                <InputLabel
                  name="firstName"
                  defaultValue={user.firstName}
                  required
                >
                  First Name
                </InputLabel>
                <InputLabel
                  name="lastName"
                  defaultValue={user.lastName}
                  required
                >
                  Last Name
                </InputLabel>
                <InputLabel name="middleInitial" className="w-12">
                  Initials
                </InputLabel>
              </div>
              <div className="flex gap-5">
                <InputLabel
                  name="idNumber"
                  defaultValue={patient.idNumber ? patient.idNumber : ""}
                  placeholder="0000-0000"
                  required
                >
                  ID Number
                </InputLabel>
                <div className="grid grow items-center gap-1.5">
                  <Label>College</Label>
                  <Select
                    name="college"
                    defaultValue={
                      patient.college
                        ? patient.college
                        : "College of Computer Studies"
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="College of Computer Studies">
                        College of Computer Studies
                      </SelectItem>
                      <SelectItem value="College of Science and Mathematics">
                        College of Science and Mathematics
                      </SelectItem>
                      <SelectItem value="College of Engineering">
                        College of Engineering
                      </SelectItem>
                      <SelectItem value="College of Economics, Business & Accountancy">
                        College of Economics, Business & Accountancy
                      </SelectItem>
                      <SelectItem value="College of Health Sciences">
                        College of Health Sciences
                      </SelectItem>
                      <SelectItem value="College of Education">
                        College of Education
                      </SelectItem>
                      <SelectItem value="College of Arts and Social Sciences">
                        College of Arts and Social Sciences
                      </SelectItem>
                      <SelectItem value="Integrated Developmental School">
                        Integrated Developmental School
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-5">
                <InputLabel
                  defaultValue={patient.phone ? patient.phone : ""}
                  name="phone"
                >
                  Phone
                </InputLabel>
                <InputLabel
                  type="date"
                  name="birthdate"
                  defaultValue={
                    patient.birthdate
                      ? format(new Date(patient.birthdate), "yyyy-MM-dd")
                      : ""
                  }
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
                  <Select
                    name="gender"
                    value={isFemale ? "Female" : "Male"}
                    onValueChange={(input) => setIsFemale(input === "Female")}
                    defaultValue={patient.gender ? patient.gender : "Male"}
                  >
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
                  <Select
                    name="civilStatus"
                    defaultValue={
                      patient.civilStatus ? patient.civilStatus : "Single"
                    }
                  >
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
                <Textarea
                  id="address"
                  name="address"
                  defaultValue={patient.address ? patient.address : ""}
                />
              </div>
            </div>
          </div>
          <div className="grow bg-primary rounded-r-2xl p-4">
            <div className="bg-white rounded-3xl px-5 py-3 h-full flex flex-col justify-center gap-2">
              <h2 className="text-xl font-semibold">Past Medical History</h2>
              {/* <div className="flex gap-4">
                <div className="flex flex-col gap-3">
                  <div>
                    <Label>Smoke:</Label>
                    <RadioGroup
                      name="smoke"
                      className="flex"
                      defaultValue={
                        patient.smoke !== undefined
                          ? patient.smoke
                            ? "yes"
                            : "no"
                          : "no"
                      }
                    >
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
                    <RadioGroup
                      name="alcohol"
                      className="flex"
                      defaultValue={
                        patient.alcohol !== undefined
                          ? patient.alcohol
                            ? "yes"
                            : "no"
                          : "no"
                      }
                    >
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
                  <Textarea
                    id="allergies"
                    name="allergies"
                    defaultValue={patient.allergies ? patient.allergies : ""}
                  />
                </div>
                <div className="grid grow items-center gap-1.5">
                  <Label htmlFor="medications">Medication/s:</Label>
                  <Textarea
                    id="medications"
                    name="medications"
                    defaultValue={
                      patient.medications ? patient.medications : ""
                    }
                  />
                </div>
              </div> */}
              <div className="flex flex-col gap-2">
                <h3 className="italic font-semibold">Chief Complaints:</h3>
                <Textarea name="healthConditions"></Textarea>
                <h3 className="italic font-semibold">
                  Current Medications Taken:
                </h3>
                <Textarea name="currentMedications"></Textarea>
                <div>
                  <h2 className="my-2 text-xl font-semibold">Vital Signs</h2>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <Label className="italic text-right">Temperature:</Label>
                    <Input
                      className="h-6 w-full"
                      name="temperature"
                      defaultValue={
                        patient?.electronicHealthRecord
                          ? patient?.electronicHealthRecord?.temperature
                          : ""
                      }
                    />
                    <p>°C</p>
                    <Label className="italic text-right">PR:</Label>
                    <Input
                      className="h-6 w-full"
                      name="pulse"
                      defaultValue={
                        patient?.electronicHealthRecord
                          ? patient?.electronicHealthRecord?.pulse
                          : ""
                      }
                    />
                    <p>bpm</p>
                    <Label className="italic text-right">RR:</Label>
                    <Input
                      className="h-6 w-full"
                      name="respiration"
                      defaultValue={
                        patient?.electronicHealthRecord
                          ? patient?.electronicHealthRecord?.respiration
                          : ""
                      }
                    />
                    <p>bpm</p>
                    <Label className="italic text-right">BP:</Label>
                    <Input
                      className="h-6 w-full"
                      name="bloodPressure"
                      defaultValue={
                        patient?.electronicHealthRecord
                          ? patient?.electronicHealthRecord?.bloodPressure
                          : ""
                      }
                    />
                    <p>mmhg</p>
                    <Label className="italic text-right">WT:</Label>
                    <Input
                      className="h-6 w-full"
                      name="weight"
                      defaultValue={
                        patient?.electronicHealthRecord
                          ? patient?.electronicHealthRecord?.weight
                          : ""
                      }
                    />
                    <p>kg</p>
                    <Label className="italic text-right">Oxygen:</Label>
                    <Input
                      className="h-6 w-full"
                      name="oxygen"
                      defaultValue={
                        patient?.electronicHealthRecord
                          ? patient?.electronicHealthRecord?.oxygen
                          : ""
                      }
                    />
                    <p>
                      O<sup>2</sup> sat
                    </p>
                  </div>
                </div>
                {/* <div className="grid grid-cols-4">
                  {conditions.map((condition: string, i: number) => (
                    <div key={`condition-${i}`} className="flex items-center gap-2">
                      <Checkbox
                        id={condition}
                        name={condition}
                        defaultChecked={patient.medicalConditions?.includes(condition)}
                      />
                      <label htmlFor={condition} className="italic text-sm">
                        {condition}
                      </label>
                    </div>
                  ))}
                  {conditions.length === 0
                    ? skeletonSizes.map((e, i) => (
                        <Skeleton key={`skeleton-${i}`} className="h-3 my-1" style={{ width: e }} />
                      ))
                    : ""}
                </div> */}
                {isFemale ? (
                  <div className="mt-3">
                    <h3 className="italic font-semibold">For Women:</h3>
                    <div className="flex items-center gap-2">
                      <Label>Date of Last Menstrual Period (LMP)</Label>
                      <Input
                        type="date"
                        name="lastMenstrualPeriod"
                        className="w-fit"
                        defaultValue={
                          editMode && isFemale
                            ? patient.lastMenstrualPeriod
                              ? format(
                                  new Date(patient.lastMenstrualPeriod),
                                  "yyyy-MM-dd"
                                )
                              : ""
                            : ""
                        }
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>Menstrual Pattern:</Label>
                      <RadioGroup
                        name="menstrualPattern"
                        className="flex"
                        defaultValue={
                          patient.menstrualPattern !== undefined
                            ? patient.menstrualPattern
                              ? "Regular"
                              : "Irregular"
                            : "Irregular"
                        }
                        required
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem
                            id="menstrual-regular"
                            value="Regular"
                          />
                          <Label htmlFor="menstrual-regular">Regular</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem
                            id="menstrual-irregular"
                            value="Irregular"
                          />
                          <Label htmlFor="menstrual-irregular">Irregular</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="self-end">
                  <Button
                    variant="ghost"
                    type="button"
                    className="w-fit mr-2"
                    onClick={back}
                  >
                    Back
                  </Button>
                  <Button className="w-fit" disabled={buttonLoad}>
                    {buttonLoad ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      ""
                    )}
                    {verifyMode ? "PROCEED" : "SUBMIT"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
        <Logo />
      </main>
    );
  return (
    <main className="flex items-center justify-center h-screen">
      <div className="flex flex-col justify-center items-center gap-3">
        <Image
          src="/logo.png"
          alt="logo"
          width={150}
          height={150}
          className="w-auto animate-pulse"
          priority
        />
      </div>
    </main>
  );
}
