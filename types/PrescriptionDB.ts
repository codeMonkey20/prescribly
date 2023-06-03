import { Prescription } from "./Prescription";

export type PrescriptionDB = {
  userID?: string;
  idNumber?: string;
  healthConditions?: string;
  prescriptions?: Prescription[];
};
