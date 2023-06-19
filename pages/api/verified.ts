import type { NextApiRequest, NextApiResponse } from "next";
import Staff from "@/models/Staff";

export default async function verified(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  // check terms
  const id = req.query.id;
  const staff = await Staff.findOne({ userID: id });
  const verified =
    staff.terms === true && (staff.license !== "" || staff.license !== undefined) && staff.expire?.includes("T");
  res.json({ verified });

  res.end();
  return;
}
