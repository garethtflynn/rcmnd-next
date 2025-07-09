import prisma from "@/libs/db";
import { NextResponse } from "next/server";
import { compare } from "bcryptjs";

export async function PATCH(req, res) {
  const { currentPassword, newPassword } = req.body;
  const userId = req.query.id;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await compare(currentPassword, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Incorrect current password" });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: "Password too short" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await db.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return res.status(200).json({ message: "Password updated successfully" });
}
