import prisma from "@/lib/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });
  const { topicId } = req.body;
  const session = await getServerSession(req, res, authOptions);
  if (!session)
    return res.status(401).json({ message: "Login to like a topic" });
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
  });
  // console.log(topicId);

  try {
    const selectedPost = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { likes: true },
    });

    const alreadyLiked = selectedPost?.likes?.some(
      (like) => like.likedByUserId === user?.id
    );

    if (alreadyLiked) {
      const unliked = await prisma.like.deleteMany({
        where: { AND: [{ likedByUserId: user?.id }, { topicId }] },
      });
      // console.log(unliked);
      res.status(201).json({ unliked });
    } else {
      const liked = await prisma.like.create({
        data: {
          likedByUserId: user?.id,
          topicId,
        },
      });
      res.status(201).json({ liked });
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error has occured while liking the topic" });
  }
}
