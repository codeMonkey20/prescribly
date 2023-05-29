import User from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

export default async function user(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      const { email, password, firstName, lastName, usertype } =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const hash = await bcrypt.hash(password, 8);
      const user = await User.create({
        email,
        password: hash,
        firstName,
        lastName,
        usertype,
      });
      res.status(200).json(user);
      return;

    case "GET":
      const { withPassword, ...userQueries } = req.query;
      const allUsers = await User.find(userQueries);
      if (withPassword === "false" || withPassword === undefined) {
        const allUsersWithoutPassword: any = [];
        allUsers.forEach((user) => {
          delete user._doc.password;
          allUsersWithoutPassword.push(user);
        });
        res.status(200).json(allUsersWithoutPassword);
      } else {
        res.status(200).json(allUsers);
      }
      return;

    default:
      res.status(405).json({ error: "Method Not Allowed" });
      return;
  }
}
