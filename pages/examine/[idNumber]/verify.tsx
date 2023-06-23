import { InputLabel } from "@/components/InputLabel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { FormEvent, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { HealthRecord } from "@/types/HealthRecord";
import { useSession } from "next-auth/react";

type PhysicalList = {
  apiName: string;
  label: string;
};

export default function PatientRegister() {
  const router = useRouter();
  const session = useSession();
  const [buttonLoad, setButtonLoad] = useState(false);
  const [physicalList, setPhysicalList] = useState<PhysicalList[]>([]);
  const [patient, setPatient] = useState<PatientDB>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!(e.target instanceof HTMLFormElement)) return;
    setButtonLoad(true);
    const formData = new FormData(e.target);
    const formDataJSON = Object.fromEntries(formData.entries());
    const body: HealthRecord = JSON.parse(JSON.stringify(formDataJSON));

    let familyHistory = "";
    for (const form in body) {
      if (body[form as keyof HealthRecord] === "on") {
        familyHistory = `${familyHistory}, ${form}`;
        delete body[form as keyof HealthRecord];
      }
    }
    familyHistory = familyHistory.substring(2);
    if (body.otherFamilyHistory !== "") {
      familyHistory = `${familyHistory}, ${body.otherFamilyHistory}`;
    }
    body.familyHistory = familyHistory;
    body.temperature = parseFloat(body.temperature + "");
    body.pulse = parseFloat(body.pulse + "");
    body.respiration = parseFloat(body.respiration + "");
    body.weight = parseFloat(body.weight + "");
    log(body);
    log(patient);
    await axios.put(`/api/patient/${patient.userID}`, { examinedBy: session.data?.user._id });
    await axios.put(`/api/patient/health-record/${patient.userID}`, body);
    router.push(`/examine/${router.query.idNumber}`);
  };

  useEffect(() => {
    axios.get("/api/lists/physical-exam").then(({ data }) => setPhysicalList(data));
  }, []);

  useEffect(() => {
    if (router.query.idNumber) {
      axios.get(`/api/patient?idNumber=${router.query.idNumber}`).then(({ data }) => setPatient(data[0]));
    }
  }, [router.query]);
  log(patient);

  return (
    <main className="flex justify-center items-center h-screen bg-white">
      <form className="w-11/12 h-5/6 border-4 border-primary rounded-3xl flex" onSubmit={handleSubmit}>
        <div className="w-2/5 px-6 flex flex-col justify-center gap-1">
          <div>
            <h2 className="my-2 text-xl font-semibold">Family History</h2>
            <p className="italic font-thin">
              Do you have a close relative (parents, siblings, grandparents) who have been diagnose of:
            </p>
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-2">
                <Checkbox id="hypertension" name="hypertension" />
                <label htmlFor="hypertension" className="italic text-sm">
                  Hypertension
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="tuberculosis" name="tuberculosis" />
                <label htmlFor="tuberculosis" className="italic text-sm">
                  Tuberculosis
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="heartDisease" name="heartDisease" />
                <label htmlFor="heartDisease" className="italic text-sm">
                  Heart Disease
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="asthma" name="asthma" />
                <label htmlFor="asthma" className="italic text-sm">
                  Asthma
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="diabetes" name="diabetes" />
                <label htmlFor="diabetes" className="italic text-sm">
                  Diabetes
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="allergies" name="allergies" />
                <label htmlFor="allergies" className="italic text-sm">
                  Allergies
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="cancer" name="cancer" />
                <label htmlFor="cancer" className="italic text-sm">
                  Cancer
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="others" name="others" />
              <label htmlFor="others" className="italic text-sm">
                any other hereditary disease
              </label>
            </div>
            <Textarea name="otherFamilyHistory" className="mt-1" />
          </div>
          <div>
            <h2 className="my-2 text-xl font-semibold">Vital Signs</h2>
            <div className="grid grid-cols-3 gap-2 items-center">
              <Label className="italic text-right">Temperature:</Label>
              <Input className="h-6 w-full" name="temperature" />
              <p>°C</p>
              <Label className="italic text-right">PR:</Label>
              <Input className="h-6 w-full" name="pulse" />
              <p>bpm</p>
              <Label className="italic text-right">RR:</Label>
              <Input className="h-6 w-full" name="respiration" />
              <p>bpm</p>
              <Label className="italic text-right">BP:</Label>
              <Input className="h-6 w-full" name="bloodPressure" />
              <p>mmhg</p>
              <Label className="italic text-right">WT:</Label>
              <Input className="h-6 w-full" name="weight" />
              <p>kg</p>
            </div>
          </div>
        </div>
        <div className="grow bg-primary rounded-r-2xl p-4">
          <div className="bg-white rounded-3xl px-5 py-3 h-full flex flex-col justify-center gap-2">
            <h2 className="text-xl font-semibold">Past Medical History</h2>
            <div className="grow grid grid-cols-4 items-center">
              <div></div>
              <div className="text-sm">NORMAL</div>
              <div className="text-sm">ABNORMAL</div>
              <div className="text-sm">REMARKS</div>
              {physicalList.map((e, i) => (
                <React.Fragment key={`frag-${i}`}>
                  <div key={`label-${i}`} className="text-sm italic mr-2">
                    {e.label}
                  </div>
                  <input type="radio" key={`normal-${i}`} name={e.apiName} value="normal" defaultChecked />
                  <input type="radio" key={`abnormal-${i}`} name={e.apiName} value="abnormal" />
                  <Input key={`remarks-${i}`} name={`${e.apiName}Remarks`} className="h-4" />
                </React.Fragment>
              ))}
            </div>
            <div className="self-end">
              <Button variant="ghost" type="button" className="w-fit mr-2" onClick={router.back}>
                BACK
              </Button>
              <Button className="w-fit" disabled={buttonLoad}>
                {buttonLoad ? <Loader2 className="animate-spin mr-2" /> : ""} VERIFY
              </Button>
            </div>
          </div>
        </div>
      </form>
      <Logo />
    </main>
  );
}
