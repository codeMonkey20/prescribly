import Staff from "@/models/Staff";
import User from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function staffDynamic(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      const newstaff = await Staff.create({ userID: req.query.id, ...req.body });
      await User.findByIdAndUpdate(req.query.id, { usertypeID: newstaff._id });
      res.status(200).json(newstaff);
      return;
    case "PUT":
      const updatedpatient = await Staff.findOneAndUpdate({ userID: req.query.id }, req.body);
      res.status(200).json(updatedpatient);
      return;
    case "GET":
      const patient = await Staff.findOne({ userID: req.query.id });
      res.status(200).json(patient);
      return;
  }
}
