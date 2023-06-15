import MIMS from "@/models/MIMS";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function mimsCount(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      const count = (await MIMS.find(req.query)).length;
      res.status(200).json({ count });
      res.end();
      return;
  }
}
