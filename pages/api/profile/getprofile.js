import prisma from "@/lib/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email,
      },
    });
    const data = await prisma.profile.findUnique({
      where: { userId: user?.id },
      include: { user: true },
    });
    console.log(data);
    res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    res
      .status(403)
      .json({ err, message: "Error has occured while getting the profile" });
  }
}
