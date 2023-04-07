import prisma from "@/lib/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });
  const session = await getServerSession(req, res, authOptions);
  if (!session)
    return res
      .status(401)
      .json({ message: "Login to see your discussion topic" });

  try {
    const data = await prisma.topic.findMany({
      where: { userId: session?.id },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        comments: true,
      },
    });
    const commentCount = await prisma.comment.count({
      where: { topic: { userId: session?.id } },
    });
    console.log(commentCount);
    res.status(200).json({ topic: data, commentCount });
  } catch (err) {
    res.status(403).json({ err: "Error has occured while getting the topics" });
  }
}
