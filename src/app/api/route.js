import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./auth/[...nextauth]/route";

export async function GET (req, res) {
    const session = await getServerSession(authOptions)
    console.log('GET API ', session)
    return NextResponse.json({ authenticated: !!session });
}