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

  const { email, password, firstName, lastName, usertype, birthdate, phone, address, userID, middleInital } = req.body;
  const hash = await bcrypt.hash(password, 8);
  await User.findByIdAndUpdate(userID, { email, firstName, lastName, password: hash });
  switch (usertype) {
    case "Patient":
      await Patient.findOneAndUpdate({ userID }, { firstName, lastName, birthdate, phone, address, middleInital });
      break;

    case "Admin":
      break;

    default:
      await Staff.findOneAndUpdate({ userID }, { firstName, lastName, birthdate, phone, address, middleInital });
      break;
  }
  res.json({ firstName, lastName, birthdate, phone, address, email });
  res.end();
  return;
}
