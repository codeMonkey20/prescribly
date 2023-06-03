import Patient from "@/models/Patient";
import User from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function patient(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      const allUsers = await Patient.find(req.query);
      res.status(200).json(allUsers);
      return;
  }
}
