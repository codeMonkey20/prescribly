import Patient from "@/models/Patient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function consultaitonsCount(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      const consultationNumber = (await Patient.find({ consultation: { $exists: true } }).count()) + 1;
      res.json({ count: consultationNumber });
      return;
    default:
      res.end();
      return;
  }
}
