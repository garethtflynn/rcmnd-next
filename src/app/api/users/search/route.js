import prisma from "@/libs/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") || ""; // Get the search query from URL params
  
//   if (query.trim() === "") {
//     return new NextResponse(JSON.stringify([]), {
//       // Return empty array if query is empty
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   }

  // Fetch users from the database using Prisma, filtered by name or email
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
