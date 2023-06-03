import User from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function prescription(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      
      return;

    case "PUT":

      return;

    default:
      res.status(405).json({ error: "Method Not Allowed" });
      return;
  }
}
