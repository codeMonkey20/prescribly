export type HealthRecord = {
  familyHistory?: string;
  otherFamilyHistory?: string;

  // vital signs
  temperature?: number;
  pulse?: number;
  respiration?: number;
  bloodPressure?: number;
  weight?: number;

  // physical exam
  skin?: string;
  skinRemarks?: string;
  headNeckScalp?: string;
  headNeckScalpRemarks?: string;
  eyes?: string;
  eyesRemarks?: string;
  ears?: string;
  earsRemarks?: string;
  noseSinuses?: string;
  noseSinusesRemarks?: string;
  mouthThroat?: string;
  mouthThroatRemarks?: string;
  neckThyroid?: string;
  neckThyroidRemarks?: string;
  chestBreastAxilla?: string;
  chestBreastAxillaRemarks?: string;
  lungs?: string;
  lungsRemarks?: string;
  heart?: string;
  heartRemarks?: string;
  abdomen?: string;
  abdomenRemarks?: string;
  backFlank?: string;
  backFlankRemarks?: string;
  anusRectum?: string;
  anusRectumRemarks?: string;
  gu?: string;
  guRemarks?: string;
  genitals?: string;
  genitalsRemarks?: string;
  reflexes?: string;
  reflexesRemarks?: string;
  extremities?: string;
  extremitiesRemarks?: string;
  neurologic?: string;
  neurologicRemarks?: string;
  endocrine?: string;
  endocrineRemarks?: string;
  others?: string;
  othersRemarks?: string;

  updatedAt?: string;
  createdAt?: string;
};
