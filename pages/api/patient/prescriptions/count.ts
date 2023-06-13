import Patient from "@/models/Patient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function prescriptionCount(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      const { today } = req.query;
      if (today === "true") {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const patients = await Patient.find({
          updatedAt: { $gte: now },
          prescription: { $ne: [] },
        });
        const count = patients.length;
        res.status(200).json({ count });
        res.end();
        return;
      }

      const patients = await Patient.find({ prescription: { $ne: [] } });
      const count = patients.length;
      res.status(200).json({ count });
      res.end();
      return;
  }
}
