import { getServerSession } from "next-auth/next";
import prisma from "@/lib/client";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req, res) => {
  if (req.method === "PUT") {
    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res.status(401).json({ message: "Login to change job info" });

    const { jobStatus, designation, company, joiningDate } = req.body;
    if (jobStatus === "EMPLOYED")
      try {
        const updatedUserName = await prisma.profile.update({
          where: { userId: session?.id },
          data: {
            jobStatus,
            designation,
            company,
            joiningDate: new Date(joiningDate).toISOString(),
          },
        });
        res.status(200).json({ updatedUserName });
      } catch (err) {
        console.log({ all: err });
        res
          .status(403)
          .json({ message: "Error has occured while changing the Job Info" });
      }
    else
      try {
        const updatedUserName = await prisma.profile.update({
          where: { userId: session?.id },
          data: {
            jobStatus,
            designation: null,
            company: null,
            joiningDate: null,
          },
        });
        res.status(200).json({ updatedUserName });
      } catch (err) {
        res
          .status(403)
          .json({ message: "Error has occured while changing the Job Info" });
      }
  }
};

export default handler;
