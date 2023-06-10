import User from "@/models/User";
import { UserDB } from "@/types/UserDB";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function userNonPatients(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      const { search, page, ...query } = req.query;
      let allUsers: UserDB[] = [];
      if (search) {
        const regex = new RegExp(`.*${search}.*`, "i");
        allUsers = await User.find({
          $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }, { fullName: { $regex: regex } }],
          usertype: { $in: ["Doctor", "Pharmacist"] },
        });
      } else allUsers = await User.find({ usertype: { $in: ["Doctor", "Pharmacist"] }, ...query });

      if (page) {
        const pages = parseInt(page.toString());
        const LIMIT = 4;
        allUsers = allUsers.filter((_, i) => i + 1 >= pages * LIMIT - (LIMIT - 1) && i + 1 <= pages * LIMIT);
      }
      res.json(allUsers);
      return;

    default:
      res.status(405).json({ error: "Method Not Allowed" });
      return;
  }
}
