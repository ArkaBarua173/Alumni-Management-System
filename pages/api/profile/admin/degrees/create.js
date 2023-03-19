import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
import prisma from "@/lib/client";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res.status(401).json({ message: "Login to add a degree" });

    const { name, department } = req.body;
    if (name === "" || department === "")
      return res
        .status(400)
        .json({ message: "Please fill up name and department" });

    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email,
      },
    });
    try {
      const createdDegree = await prisma.degree.create({
        data: {
          name,
          department,
          createdByUserId: user?.id,
        },
      });
      res.status(201).json({ createdDegree });
    } catch (err) {
      console.log(err);
      res.status(403).json({
        error: err,
        message: "Error has occured while creating the degree",
      });
    }
  }
};

export default handler;
