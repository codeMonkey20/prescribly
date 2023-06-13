import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import User from "@/models/User";
import Patient from "@/models/Patient";
import Staff from "@/models/Staff";

export default async function profileUpdate(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { usertype, password, userID, ...requestBody } = req.body;
  const hash = await bcrypt.hash(password, 8);
  await User.findByIdAndUpdate(userID, { password: hash, ...requestBody });
  switch (usertype) {
    case "Patient":
      await Patient.findOneAndUpdate({ userID }, requestBody);
      break;

    case "Admin":
      break;

    default:
      await Staff.findOneAndUpdate({ userID }, requestBody);
      break;
  }
  res.json(requestBody);
  res.end();
  return;
}
