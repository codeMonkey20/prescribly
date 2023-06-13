import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

export default function upload(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const file = req.body.file;
    const filePath = `//${file.name}`;
    // console.log(__dirname);

    // Save the file to the local file system
    // fs.writeFileSync(filePath, file.data);

    res.status(200).json({ message: "File uploaded successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
