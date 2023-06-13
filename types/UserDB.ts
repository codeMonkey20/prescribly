import { PatientDB } from "./PatientDB";
import { StaffDB } from "./StaffDB";

export type UserDB = {
  _id?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  usertype?: "Patient" | "Doctor" | "Pharmacist" | "Admin";
  usertypeID?: string;
  usertypeData?: PatientDB & StaffDB;
};
