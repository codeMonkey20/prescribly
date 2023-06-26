import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@/models/User";
import Patient from "@/models/Patient";
import Staff from "@/models/Staff";
import log from "@/lib/log";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email ? credentials?.email : "";
        const password = credentials?.password ? credentials?.password : "";
        const user = await User.findOne({ email });
        if (!user) return null;
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (isPasswordMatch) {
          return {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        log({ ...token, ...session.user });
        return { ...token, ...session.user };
      }
      return { ...token, ...user };
    },

    async session({ session, token }: { session: any; token: any }) {
      if (session) {
        const { _doc } = await User.findOne({ email: session.user.email });
        const { password, __v, ...user } = _doc;
        switch (user.usertype) {
          case "Patient":
            user.usertypeData = await Patient.findOne({ userID: user._id });
            break;
          case "Admin":
            user.verified = true;
            break;
          default:
            const staff = await Staff.findOne({ userID: user._id });
            const verified =
              staff.terms === true &&
              (staff.license !== "" || staff.license !== undefined) &&
              (staff.expire !== "" || staff.expire !== undefined);
            user.usertypeData = staff;
            user.verified = verified;
            break;
        }
        return {
          ...session,
          user,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
export default NextAuth(authOptions);
