import prisma from "@/libs/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") || "";
  
if (query.trim() === "" || query.trim().length < 2) {
  return new NextResponse(JSON.stringify([]), {
    headers: { "Content-Type": "application/json" },
  });
}

  const filteredUsers = await prisma.user.findMany({
    where: {
      OR: [
        { firstName: { equals: query, mode: "insensitive" } },
        { lastName: { equals: query, mode: "insensitive" } },
      ],
    },
  });

  // Return the filtered users as JSON response
  return new NextResponse(JSON.stringify(filteredUsers), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
