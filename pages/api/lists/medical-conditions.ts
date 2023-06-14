import type { NextApiRequest, NextApiResponse } from "next";

export default function medicalConditionsList(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  res
    .status(200)
    .json([
      "Allergies",
      "Amoebiasis",
      "Anemia",
      "Arthritis",
      "Back and Joint Pains",
      "Bone Fracture",
      "Breast Mass/Lump",
      "Chest Pains",
      "Chicken Pox",
      "Diabetes",
      "Epilepsy",
      "Eye Problem",
      "Ear Problem",
      "Gallbladder Stone",
      "Goiter",
      "Hemorrhoids",
      "Hepatitis: A/B",
      "Hyperacidity/Ulcer",
      "Hypertension",
      "Kidney/Bladder Stone",
      "Loss of Consciousness",
      "Measles",
      "Mumps",
      "Pneumonia",
      "Prostate Problems",
      "Seizure",
      "Sinusitis",
      "Skin Disorders",
      "STI/HIV",
      "Stroke",
      "Surgery/Injury",
      "Thyroid Problems",
      "Tonsilitis",
      "Tuberculosis",
      "UTI",
      "Others",
    ]);
}
