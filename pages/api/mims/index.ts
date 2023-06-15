import MIMS from "@/models/MIMS";
import { MimsDB } from "@/types/MimsDB";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function mims(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      const { search, page, ...query } = req.query;
      let allMims: MimsDB[] = [];
      if (search) {
        const regex = new RegExp(`.*${search}.*`, "i");
        allMims = await MIMS.find({ name: { $regex: regex }, ...query });
      } else allMims = await MIMS.find(query);

      if (page) {
        const pages = parseInt(page.toString());
        const LIMIT = 4;
        allMims = allMims.filter((_, i) => i + 1 >= pages * LIMIT - (LIMIT - 1) && i + 1 <= pages * LIMIT);
      }

      res.status(200).json(allMims);
      res.end();
      return;
    case "POST":
      const newmims = await MIMS.create(req.body);
      res.json(newmims);
      return;
  }
}
