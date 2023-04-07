import prisma from "@/lib/client";
import path from "path";
import fs from "fs/promises";

export default async function handler(req, res) {
  // res.status(200).json({ name: 'John Doe' })
  if (req.method !== "DELETE")
    return res.status(405).json({ message: "Method not allowed" });
  const { selectedEvents } = req.body;
  //   console.log("hello");
  //   console.log(req.body);
  try {
    selectedEvents?.map(async (selectedEvent) => {
      const data = await prisma.event.delete({
        where: {
          id: selectedEvent,
        },
      });
      const filePath = path.join(
        process.cwd(),
        "public",
        "images",
        data?.banner
      );

      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).send({ message: "Error deleting file" });
        }
      });
    });
    res.status(200).json({ message: "Deleted Selected Events" });
  } catch {
    console.log(err);
    res
      .status(403)
      .json({ err: "Error has occured while deleting the events" });
  }
}
