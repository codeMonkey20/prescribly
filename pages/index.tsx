import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import User from "@/models/User";
import { UserDB } from "@/types/UserDB";
import bcrypt from "bcrypt";

export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);

  // create default admin account
  const adminUser = await User.findOne({ email: "admin" });
  if (!adminUser) {
    const hash = await bcrypt.hash("123123", 8);
    const adminDetails: UserDB = {
      email: "admin",
      password: hash,
      firstName: "admin",
      lastName: "admin",
      usertype: "Admin",
    };
    await User.create(adminDetails);
  }

  if (!session) {
    return {
      redirect: {
        destination: `/login`,
        permanent: false,
      },
    };
  } else if (!session.user.usertypeID && session.user.usertype !== "Admin") {
    return {
      redirect: {
        destination: `/register?id=${session.user._id}`,
        permanent: false,
      },
    };
  }
  return {
    redirect: {
      destination: `/dashboard`,
      permanent: false,
    },
  };
}

export default function Home() {
  return <></>;
}
