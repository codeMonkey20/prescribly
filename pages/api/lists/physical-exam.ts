import type { NextApiRequest, NextApiResponse } from "next";

export default function physicalExamList(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  res.status(200).json([
    { apiName: "skin", label: "Skin" },
    { apiName: "headNeckScalp", label: "Head, Neck, Scalp" },
    { apiName: "eyes", label: "Eyes" },
    { apiName: "ears", label: "Ears" },
    { apiName: "noseSinuses", label: "Nose, Sinuses" },
    { apiName: "mouthThroat", label: "Mouth, Throat" },
    { apiName: "neckThyroid", label: "Neck, LN, Thyroid" },
    { apiName: "chestBreastAxilla", label: "Chest-Breast-Axilla" },
    { apiName: "lungs", label: "Lungs" },
    { apiName: "heart", label: "Heart" },
    { apiName: "abdomen", label: "Abdomen" },
    { apiName: "backFlank", label: "Back, Flank" },
    { apiName: "anusRectum", label: "Anus-Rectum" },
    { apiName: "gu", label: "GU System" },
    { apiName: "genitals", label: "Inguinals, Genitals" },
    { apiName: "reflexes", label: "Reflexes" },
    { apiName: "extremities", label: "Extremities" },
    { apiName: "neurologic", label: "Neurologic" },
    { apiName: "endocrine", label: "Endocrine" },
    { apiName: "others", label: "Others" },
  ]);
}
