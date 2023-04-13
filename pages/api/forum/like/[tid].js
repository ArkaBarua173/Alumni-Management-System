import prisma from "@/lib/client";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });
  const { tid } = req.query;
  // console.log(req.query);
  try {
    const data = await prisma.topic.findMany({
      where: {
        id: tid,
      },
      select: {
        likes: true,
      },
    });
    res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error has occured while getting the events" });
  }
}
