import { PatientDB } from "./PatientDB";

export type UserDB = {
  _id?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  usertype?: "Patient" | "Doctor" | "Pharmacist" | "Admin";
  usertypeID?: string;
  usertypeData?: PatientDB;
};
