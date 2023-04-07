import prisma from "@/lib/client";
import path from "path";
import fs from "fs/promises";

export default async function handler(req, res) {
  // res.status(200).json({ name: 'John Doe' })
  if (req.method !== "DELETE")
    return res.status(405).json({ message: "Method not allowed" });
  const { deleteId } = req.query;
  console.log(deleteId);
  try {
    const data = await prisma.event.delete({
      where: {
        id: deleteId,
      },
    });
    const filePath = path.join(process.cwd(), "public", "images", data?.banner);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: "Error deleting file" });
      }
    });
    res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error has occured while deleting the event" });
  }
}
