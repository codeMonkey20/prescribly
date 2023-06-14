export type PatientRegistration = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  initials?: string;
  idNumber: string;
  college?:
    | "College of Computer Studies"
    | "College of Science and Mathematics"
    | "College of Engineering"
    | "College of Economics, Business & Accountancy"
    | "College of Health Sciences"
    | "College of Education"
    | "College of Arts and Social Sciences"
    | "Integrated Developmental School";
  phone?: string;
  birthdate?: Date;
  age?: number;
  gender?: "Male" | "Female";
  civilStatus?: "Single" | "Married" | "Widowed" | "Divorced";
  address?: string;
  smoke?: boolean;
  alcohol?: boolean;
  allergies?: string;
  medications?: string;
  medicalConditions?: string;
};
