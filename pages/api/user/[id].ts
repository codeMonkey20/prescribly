import User from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function userDynamic(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;
  switch (req.method) {
    case "PUT":
      const updateduser = await User.findByIdAndUpdate(id, req.body);
      res.status(200).json(updateduser);
      return;

    case "GET":
      const user = await User.findById(id);
      res.status(200).json(user);
      return;

    default:
      res.status(405).json({ error: "Method Not Allowed" });
      return;
  }
}
