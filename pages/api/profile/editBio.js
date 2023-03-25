import { getServerSession } from "next-auth/next";
import prisma from "@/lib/client";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req, res) => {
  if (req.method === "PUT") {
    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res.status(401).json({ message: "Login to change profile info" });

    const { bio } = req.body;

    const profile = await prisma.profile.findUnique({
      where: {
        userId: session?.id,
      },
    });
    if (profile?.bio === bio)
      return res.status(400).json({ message: `No change in bio dectected` });
    try {
      const updatedBio = await prisma.profile.update({
        where: { userId: session?.id },
        data: {
          bio,
        },
      });
      res.status(200).json({ updatedBio });
    } catch (err) {
      res
        .status(403)
        .json({ message: "Error has occured while changing the bio" });
    }
  }
};

export default handler;
