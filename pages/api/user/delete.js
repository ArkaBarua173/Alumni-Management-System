import prisma from "@/lib/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req, res) => {
  if (req.method === "DELETE") {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session?.role !== "ADMIN")
      return res
        .status(401)
        .json({ message: "Only Admin can perform this action" });

    console.log(req.body);

    try {
      const deleteUser = await prisma.user.delete({
        where: {
          id: req.body,
        },
      });
      res.status(200).json({ deleteUser });
    } catch (err) {
      res
        .status(403)
        .json({ err: "Error has occured while performing this action" });
    }
  }
};

export default handler;
