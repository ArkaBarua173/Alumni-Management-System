import prisma from "@/lib/client";

export default async function handler(req, res) {
  if (req.method !== "DELETE")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const data = await prisma.topic.delete({
      where: {
        id: req.body,
      },
    });

    res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error has occured while deleting the topic" });
  }
}
