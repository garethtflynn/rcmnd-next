import prisma from "@/libs/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { compare, hash } from "bcrypt";

export async function PATCH(req, { params }) {
  try {
    const { newPassword } = await req.json();

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // const isMatch = await compare(currentPassword, user.password);

    // if (!isMatch) {
    //   return NextResponse.json(
    //     { message: "Incorrect current password" },
    //     { status: 401 }
    //   );
    // }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "Password too short" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
