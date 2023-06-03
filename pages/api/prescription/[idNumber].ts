import Prescription from "@/models/Prescription";
import User from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function prescriptionDynamic(req: NextApiRequest, res: NextApiResponse) {
  const idNumber = req.query.idNumber;

  switch (req.method) {
    case "POST":
      const newPrescription = await Prescription.create(req.body);
      res.json(newPrescription);
      return;

    case "PUT":
      const updatePrescription = await Prescription.findByIdAndUpdate(idNumber, req.body);
      res.json(updatePrescription);
      return;

    case "GET":
      const prescription = await Prescription.findById(idNumber);
      res.json(prescription);
      return;

    default:
      res.status(405).json({ error: "Method Not Allowed" });
      return;
  }
}
