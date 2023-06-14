import Staff from "@/models/Staff";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function upload(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const id = req.query.id;
    const file = req.body.file;
    await Staff.findOneAndUpdate({ userID: id }, { signature: file });

    res.status(200).json({ message: "File uploaded successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
