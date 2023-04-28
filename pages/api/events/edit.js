import formidable from "formidable";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import path from "path";
import fs from "fs/promises";
import prisma from "@/lib/client";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method === "PUT") {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session?.role !== "ADMIN")
      return res
        .status(401)
        .json({ message: "Only Admin can create an event" });

    try {
      await fs.readdir(path.join(process.cwd() + "/public", "/images"));
    } catch (error) {
      await fs.mkdir(path.join(process.cwd() + "/public", "/images"));
    }

    const options = {};
    options.uploadDir = path.join(process.cwd(), "/public/images");
    options.filename = (name, ext, path, form) => {
      return Date.now().toString() + "_" + path.originalFilename;
    };

    const form = formidable(options);
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: "Something went wrong" });
        return;
      }

      console.log(files);
      const { id, title, date, description, oldBanner } = fields;
      const formattedDate = new Date(date);
      const dstr = formattedDate.toISOString();
      const user = await prisma.user.findUnique({
        where: {
          email: session?.user?.email,
        },
      });

      if (session?.id !== user?.id)
        res
          .status(500)
          .json({ message: "Only creater of the event can update the event" });

      const filePath = path.join(process.cwd(), "public", "images", oldBanner);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).send({ message: "Error deleting previous image" });
        }
      });

      try {
        const updatedEvent = await prisma.event.update({
          where: { id },
          data: {
            title,
            date: dstr,
            description,
            userId: user.id,
            banner: files.banner.newFilename,
          },
        });

        res.status(201).json({ updatedEvent });
      } catch (err) {
        res
          .status(403)
          .json({ err: "Error has occured while updating the event" });
      }
    });
  }
};

export default handler;
