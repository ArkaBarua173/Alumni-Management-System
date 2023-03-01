import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(422).json({
      message: "User already exists",
    });
  }

  const hashPassword = await hash(password, 12);

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });

  return res.status(201).json({ msg: "User created", data: createdUser });
}
