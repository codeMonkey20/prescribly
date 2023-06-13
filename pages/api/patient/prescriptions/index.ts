import Patient from "@/models/Patient";
import User from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function prescriptionCount(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      const { today, userID } = req.query;
      if (today === "true") {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const patients = await Patient.find({
          updatedAt: { $gte: now },
          prescription: { $ne: [] },
        }).limit(3);
        const ids = patients.map((e) => {
          return e.userID;
        });
        const prescriptions = await User.find({ _id: { $in: ids } }).sort({ updatedAt: -1 });
        res.status(200).json(prescriptions);
        res.end();
        return;
      }

      if (userID && userID !== "") {
        if (today) {
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          const patients = await Patient.findOne({
            updatedAt: { $gte: now },
            prescription: { $ne: [] },
          });
          res.status(200).json(patients.prescription);
          res.end();
          return;
        }
        const patients = await Patient.findOne({ userID, prescription: { $ne: [] } });
        res.status(200).json(patients.prescription);
        res.end();
        return;
      }

      const patients = await Patient.find({ prescription: { $ne: [] } });
      res.status(200).json(patients);
      res.end();
      return;
  }
}
