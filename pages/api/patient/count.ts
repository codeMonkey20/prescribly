import Patient from "@/models/Patient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function patientCount(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      const patients = await Patient.find({});
      const count = patients.length;
      res.status(200).json({ count });
      res.end();
      return;
  }
}
