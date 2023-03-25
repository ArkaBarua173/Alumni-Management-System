import { getServerSession } from "next-auth/next";
import prisma from "@/lib/client";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req, res) => {
  if (req.method === "PUT") {
    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res.status(401).json({ message: "Login to change profile info" });

    const { username } = req.body;

    const profile = await prisma.profile.findUnique({
      where: {
        userId: session?.id,
      },
    });
    if (profile?.username === username)
      return res
        .status(400)
        .json({ message: `Your username was already set to ${username}.` });
    try {
      const updatedUserName = await prisma.profile.update({
        where: { userId: session?.id },
        data: {
          username,
        },
      });
      res.status(200).json({ updatedUserName });
    } catch (err) {
      res
        .status(403)
        .json({ message: "Error has occured while changing the username" });
    }
  }
};

export default handler;
