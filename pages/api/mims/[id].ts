import MIMS from "@/models/MIMS";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function mimsDynamic(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "PUT":
      const updatemims = await MIMS.findByIdAndUpdate(req.query.id, req.body);
      res.json(updatemims);
      return;
    case "DELETE":
      const destroymims = await MIMS.findByIdAndRemove(req.query.id);
      res.json(destroymims);
      return;
  }
}
