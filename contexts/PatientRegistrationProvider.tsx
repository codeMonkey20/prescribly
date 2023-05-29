import { PatientRegistration } from "@/types/PatientRegistration";
import React, { ReactNode, createContext, useState } from "react";

const PatientRegistrationContext = createContext({});
type Props = {
  children: ReactNode;
};

export default function PatientRegistrationProvider({ children }: Props) {
  const [patientRegistrationForm, setPatientRegistrationForm] = useState<PatientRegistration>();
  return (
    <PatientRegistrationContext.Provider value={{ patientRegistrationForm, setPatientRegistrationForm }}>
      {children}
    </PatientRegistrationContext.Provider>
  );
}
