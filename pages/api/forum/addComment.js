import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/client";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res.status(401).json({ message: "Login to post a comment" });

    const { topicId, body } = req.body;
    console.log(req.body);

    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email,
      },
    });
    console.log(user);
    try {
      const createdComment = await prisma.comment.create({
        data: {
          body,
          topicId,
          userId: user?.id,
        },
      });
      console.log(createdComment);
      res.status(201).json({ createdComment });
    } catch (err) {
      console.log(err);
      res
        .status(403)
        .json({ message: "Error has occured while creating the topic" });
    }
  }
};

export default handler;
