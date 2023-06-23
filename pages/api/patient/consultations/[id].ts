import Patient from "@/models/Patient";
import { PatientDB } from "@/types/PatientDB";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function consultaitonsDynamic(req: NextApiRequest, res: NextApiResponse) {
  const userID = req.query.id;
  if (!userID) {
    res.end();
    return;
  }
  switch (req.method) {
    case "POST":
      const consultationNumber = (await Patient.find({ consultation: { $exists: true } }).count()) + 1;
      const postHealthRecord = await Patient.findOneAndUpdate(
        { userID },
        { consultation: { ...req.body, consultationNumber } }
      );
      res.json(postHealthRecord);
      return;
    case "PUT":
      const consultation: PatientDB | null = await Patient.findOne({ userID });
      const consultationNum = consultation?.consultation?.consultationNumber;
      const putHealthRecord = await Patient.findOneAndUpdate(
        { userID },
        { consultation: { consultationNumber: consultationNum, ...req.body } }
      );
      res.json(putHealthRecord);
      return;
    default:
      res.end();
      return;
  }
}
