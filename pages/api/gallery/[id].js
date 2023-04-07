import prisma from "@/lib/client";
import path from "path";
import fs from "fs/promises";

export default async function handler(req, res) {
  if (req.method !== "DELETE")
    return res.status(405).json({ message: "Method not allowed" });

  const { id } = req.query;
  console.log(req.body);
  try {
    const data = await prisma.gallery.delete({
      where: { id },
    });
    const filePath = path.join(
      process.cwd(),
      "public",
      "images",
      "gallery",
      data?.photo
    );

    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: "Error deleting file" });
      }
    });
    res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error has occured while deleting the photo" });
  }
}
