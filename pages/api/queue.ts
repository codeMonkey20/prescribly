import Queue from "@/models/Queue";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function queue(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      if (req.query.nurse) {
        await Queue.findOneAndUpdate(
          {},
          {
            $push: {
              nurse: { $each: [{ idNumber: req.query.nurse }], $position: 0 },
            },
          }
        );
      }
      if (req.query.doctor) {
        await Queue.findOneAndUpdate(
          {},
          {
            $push: {
              doctor: { $each: [{ idNumber: req.query.doctor }], $position: 0 },
            },
          }
        );
      }
      if (req.query.pharmacist) {
        await Queue.findOneAndUpdate(
          {},
          {
            $push: {
              pharmacist: {
                $each: [{ idNumber: req.query.pharmacist }],
                $position: 0,
              },
            },
          }
        );
      }
      res.json({ revalidated: true });
      res.end();
      return;
    case "GET":
      const queue = await Queue.findOne({});
      res.json(queue);
      return;
    case "DELETE":
      if (req.query.nurse) {
        await Queue.findOneAndUpdate(
          {},
          { $pull: { nurse: { idNumber: req.query.nurse } } }
        );
      }
      if (req.query.doctor) {
        await Queue.findOneAndUpdate(
          {},
          { $pull: { doctor: { idNumber: req.query.doctor } } }
        );
      }
      if (req.query.pharmacist) {
        await Queue.findOneAndUpdate(
          {},
          { $pull: { pharmacist: { idNumber: req.query.pharmacist } } }
        );
      }
      res.json({ revalidated: true });
      res.end();
      return;
    default:
      res.end();
      return;
  }
}
