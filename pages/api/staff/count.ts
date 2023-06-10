import Staff from "@/models/Staff";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function staffCount(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      const staff = await Staff.find({});
      res.status(200).json({ count: staff.length });
      return;
  }
}
