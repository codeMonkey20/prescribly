export type Prescription = {
  medicationName: string;
  dosage: string;
  form: string;
  purpose: string;
  route: string;
  frequency: string;
  dispense: string;
  given: string;
  remarks: string;
  duration: string;
  updatedAt?: string | Date;
  createdAt?: string | Date;
};
