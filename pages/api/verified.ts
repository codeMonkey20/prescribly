import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import User from "@/models/User";
import Patient from "@/models/Patient";
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
    (staff.terms !== undefined || staff.terms === false) &&
    (staff.license !== undefined || staff.license !== "") &&
    (staff.expire !== undefined || staff.expire !== "");
  res.json({ verified });

  res.end();
  return;
}
