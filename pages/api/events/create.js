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
  if (req.method === "POST") {
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
      const { title, date, description } = fields;
      const formattedDate = new Date(date);
      const dstr = formattedDate.toISOString();
      console.log(dstr);
      const user = await prisma.user.findUnique({
        where: {
          email: session?.user?.email,
        },
      });
      try {
        const createdEvent = await prisma.event.create({
          data: {
            title,
            date: dstr,
            description,
            userId: user.id,
            banner: files.banner.newFilename,
          },
        });
        res.status(201).json({ createdEvent });
      } catch (err) {
        res
          .status(403)
          .json({ err: "Error has occured while making the event" });
      }
    });
  }
};

export default handler;
