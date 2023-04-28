import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/client";

const handler = async (req, res) => {
  if (req.method === "PUT") {
    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res.status(401).json({ message: "Login to create a topic" });

    const { id, title, details } = req.body;

    try {
      const updatedTopic = await prisma.topic.update({
        where: {
          id,
        },
        data: {
          title,
          details,
        },
      });
      res.status(201).json({ updatedTopic });
    } catch (err) {
      res
        .status(403)
        .json({ err: "Error has occured while creating the topic" });
    }
  }
};

export default handler;
