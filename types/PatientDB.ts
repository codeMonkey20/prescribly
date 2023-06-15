import { Prescription } from "./Prescription";

export type PatientDB = {
  userID?: string;
  firstName?: string;
  lastName?: string;
  middleInitial?: string;
  fullName?: string;
  idNumber?: string;
  college?: string;
  phone?: string;
  birthdate?: string;
  gender?: string;
  civilStatus?: string;
  address?: string;
  smoke?: boolean;
  alcohol?: boolean;
  allergies?: string;
  medications?: string;
  medicalConditions?: string;
  healthConditions?: string;
  prescription?: Prescription[];
  doctor?: string;
  createdAt?: string;
  updatedAt?: string;
  test?: string;
};
