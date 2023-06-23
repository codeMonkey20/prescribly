import { Interventions } from "./Interventions";

export type Consultation = {
  consultationNumber?: number;
  currentMedications?: string;
  interventions?: Interventions[];
  updatedAt?: string;
  createdAt?: string;
};
