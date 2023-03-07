import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/client";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res.status(401).json({ message: "Login to create a topic" });

    const { title, details } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email,
      },
    });
    try {
      const createdTopic = await prisma.topic.create({
        data: {
          title,
          details,
          userId: user?.id,
        },
      });
      res.status(201).json({ createdTopic });
    } catch (err) {
      res
        .status(403)
        .json({ err: "Error has occured while creating the topic" });
    }
  }
};

export default handler;
