import User from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

export default async function user(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      const { email, password, firstName, lastName, usertype, fullName } =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (password) {
        const hash = await bcrypt.hash(password, 8);
        const user = await User.create({
          email,
          password: hash,
          firstName,
          lastName,
          usertype,
          fullName,
        });
        res.status(200).json(user);
        return;
      }

      const user = await User.create({
        firstName,
        lastName,
        usertype,
        fullName,
      });
      res.status(200).json(user);
      return;

    case "GET":
      const { withPassword, today, ...userQueries } = req.query;
      if (today === "true") {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const users = await User.find({
          updatedAt: { $gte: now },
          usertype: { $in: ["Patient"] },
        })
          .limit(3)
          .sort({ updatedAt: -1 });
        res.status(200).json(users);
        res.end();
        return;
      } else {
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
      }

    default:
      res.status(405).json({ error: "Method Not Allowed" });
      return;
  }
}
