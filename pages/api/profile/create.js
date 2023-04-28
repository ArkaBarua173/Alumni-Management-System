import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/client";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res.status(401).json({ message: "Login to create a Profile" });

    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email,
      },
    });

    const {
      username,
      bio,
      degree,
      department,
      resultPublishedDate,
      jobStatus,
      designation,
      company,
      joiningDate,
    } = req.body;

    try {
      if (req.body.jobStatus === "EMPLOYED") {
        const createdProfile = await prisma.profile.create({
          data: {
            username,
            bio,
            degree,
            department,
            resultPublishedDate: new Date(resultPublishedDate).toISOString(),
            jobStatus,
            designation,
            company,
            joiningDate: new Date(joiningDate).toISOString(),
            userId: user?.id,
          },
        });
        res.status(201).json({ createdProfile });
      } else {
        const createdProfile = await prisma.profile.create({
          data: {
            username,
            bio,
            degree,
            department,
            resultPublishedDate: new Date(resultPublishedDate).toISOString(),
            jobStatus,
            userId: user?.id,
          },
        });
        res.status(201).json({ createdProfile });
      }
    } catch (err) {
      console.log(err);
      res.status(403).json({
        error: err,
        message: "Error has occured while creating the profile",
      });
    }
  }
};

export default handler;
