import NextAuth from "next-auth";
import { UserDB } from "./types/UserDB";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: UserDB & { verified?: boolean };
  }
}
