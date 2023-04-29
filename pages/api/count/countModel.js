import prisma from "@/lib/client";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  // res.status(200).json({ name: 'John Doe' })
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });
  const session = await getServerSession(req, res, authOptions);
  if (!session || session?.role !== "ADMIN")
    return res
      .status(401)
      .json({ message: "Only Admin can perform this action" });

  try {
    const eventCount = await prisma.event.count();
    const upcomingEventCount = await prisma.event.count({
      where: {
        date: {
          gte: new Date(Date.now()), // replace with your desired date
        },
      },
    });
    const topicCount = await prisma.topic.count();
    const userCount = await prisma.user.count();
    const galleryCount = await prisma.gallery.count();
    res.status(200).json({
      eventCount,
      upcomingEventCount,
      topicCount,
      userCount,
      galleryCount,
    });
  } catch (err) {
    console.log(err);
    res
      .status(403)
      .json({ err: "Error has occured while performing this action" });
  }
}
