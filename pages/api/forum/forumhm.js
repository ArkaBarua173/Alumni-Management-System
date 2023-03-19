import prisma from "@/lib/client";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const data = await prisma.topic.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true, comments: true },
    });
    res.status(200).json({ data });
  } catch (err) {
    res.status(403).json({ err: "Error has occured while getting the events" });
  }
}
