import Patient from "@/models/Patient";
import User from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function patientDynamic(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      const newpatient = await Patient.create({ userID: req.query.id, ...req.body });
      await User.findByIdAndUpdate(req.query.id, { usertypeID: newpatient._id });
      res.status(200).json(newpatient);
      return;
    case "PUT":
      if (req.body._id) delete req.body._id;
      const updatedpatient = await Patient.findOneAndUpdate({ userID: req.query.id }, req.body);
      res.status(200).json(updatedpatient);
      return;
    case "GET":
      const patient = await Patient.findOne({ userID: req.query.id });
      res.status(200).json(patient);
      return;
    case "DELETE":
      await Patient.findOneAndRemove({ userID: req.query.id });
      await User.findByIdAndRemove(req.query.id);
      res.status(200).json({message: "Patient Deleted"});
      return;
  }
}
