import MIMS from "@/models/MIMS";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function mims(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      const mims = await MIMS.find(req.query);
      res.json(mims);
      return;
    case "POST":
      const newmims = await MIMS.create(req.body);
      res.json(newmims);
      return;
  }
}
