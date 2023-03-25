import { getServerSession } from "next-auth/next";
import prisma from "@/lib/client";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req, res) => {
  if (req.method === "PUT") {
    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res.status(401).json({ message: "Login to change degree info" });

    const { degree, resultPublishedDate } = req.body;
    const userDegree = await prisma.degree.findUnique({
      select: { id: true },
      where: {
        name: degree,
      },
    });

    try {
      const updatedDegree = await prisma.profile.update({
        where: { userId: session?.id },
        data: {
          degreeId: userDegree?.id,
          resultPublishedDate: new Date(resultPublishedDate).toISOString(),
        },
      });
      res.status(200).json({ updatedDegree });
    } catch (err) {
      console.log({ all: err });
      res
        .status(403)
        .json({ message: "Error has occured while changing the Degree Info" });
    }
  }
};

export default handler;
