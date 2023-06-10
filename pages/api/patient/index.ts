import Patient from "@/models/Patient";
import { PatientDB } from "@/types/PatientDB";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function patient(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      const { search, page, ...query } = req.query;
      let allUsers: PatientDB[] = [];
      if (search) {
        const regex = new RegExp(`.*${search}.*`, "i");
        allUsers = await Patient.find({
          $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }, { fullName: { $regex: regex } }],
        });
      } else allUsers = await Patient.find(query);

      if (page) {
        const pages = parseInt(page.toString());
        const LIMIT = 4;
        allUsers = allUsers.filter((_, i) => i + 1 >= pages * LIMIT - (LIMIT - 1) && i + 1 <= pages * LIMIT);
      }

      res.status(200).json(allUsers);
      res.end();
      return;
  }
}
