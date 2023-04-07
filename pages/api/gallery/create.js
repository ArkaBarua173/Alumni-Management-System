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
        .json({ message: "Only Admin can add photo to the gallery" });

    // create photo folder
    try {
      await fs.readdir(
        path.join(process.cwd() + "/public", "/images", "/gallery")
      );
    } catch (error) {
      await fs.mkdir(
        path.join(process.cwd() + "/public", "/images", "/gallery")
      );
    }

    // formidable options
    const options = {};
    options.uploadDir = path.join(process.cwd(), "/public/images/gallery");
    options.filename = (name, ext, path, form) => {
      console.log(path);
      return Date.now().toString() + "_" + path.originalFilename;
    };
    options.multiples = true;
    options.maxFileSize = 1024 * 1024;

    const form = formidable(options);
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: "Something went wrong" });
        return;
      }

      const { title } = fields;
      const user = await prisma.user.findUnique({
        where: {
          email: session?.user?.email,
        },
      });

      try {
        const createdPhoto = await prisma.gallery.create({
          data: {
            title,
            userId: user?.id,
            photo: files.photo.newFilename,
          },
        });
        res.status(201).json({ createdPhoto });
      } catch (err) {
        res
          .status(403)
          .json({ err: "Error has occured while storing the photo" });
      }
    });
  }
};

export default handler;
