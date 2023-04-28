import prisma from "@/lib/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req, res) => {
  if (req.method === "PUT") {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session?.role !== "ADMIN")
      return res
        .status(401)
        .json({ message: "Only Admin can perform this action" });

    const { id, role } = req.body;

    try {
      const changedRole = await prisma.user.update({
        where: {
          id,
        },
        data: {
          role,
        },
      });
      res.status(201).json({ changedRole });
    } catch (err) {
      res
        .status(403)
        .json({ err: "Error has occured while performing this action" });
    }
  }
};

export default handler;
