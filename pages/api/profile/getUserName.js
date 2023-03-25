import prisma from "@/lib/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  const session = await getServerSession(req, res, authOptions);
  if (!session)
    return res.status(401).json({ message: "Login to change username" });

  try {
    const data = await prisma.profile.findUnique({
      select: { username: true },
      where: { userId: session?.id },
    });
    res.status(200).json({ data });
  } catch (err) {
    res.status(403).json({ err });
  }
}
