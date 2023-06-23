import Patient from "@/models/Patient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function healthRecordDynamic(req: NextApiRequest, res: NextApiResponse) {
  const userID = req.query.id;
  if (!userID) {
    res.end();
    return;
  }
  switch (req.method) {
    case "PUT":
      const putHealthRecord = await Patient.findOneAndUpdate({ userID }, { electronicHealthRecord: req.body });
      res.json(putHealthRecord);
      return;
    default:
      res.end();
      return;
  }
}
