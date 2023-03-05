import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  // res.status(200).json({ name: 'John Doe' })
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });
  const { eid } = req.query;
  try {
    const data = await prisma.event.findUnique({
      where: {
        id: eid,
      },
    });
    res.status(200).json({ data });
  } catch (err) {
    res.status(403).json({ err: "Error has occured while getting the events" });
  }
}
