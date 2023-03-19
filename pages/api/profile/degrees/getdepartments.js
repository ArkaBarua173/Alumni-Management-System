import prisma from "@/lib/client";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const data = await prisma.degree.findMany({
      select: { department: true },
      distinct: ["department"],
    });
    res.status(200).json({ data });
  } catch (err) {
    res
      .status(403)
      .json({ err, message: "Failed to fetch distinct departments" });
  }
}
