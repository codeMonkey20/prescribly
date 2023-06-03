import User from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function userNonPatients(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      const allUsers = await User.find({ usertype: { $in: ["Doctor", "Pharmacist"] } });
      res.json(allUsers);
      return;

    default:
      res.status(405).json({ error: "Method Not Allowed" });
      return;
  }
}
