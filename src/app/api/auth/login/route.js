import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request) {
  const { identifier, password } = await request.json();

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier },
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const response = NextResponse.json({ message: "Login successful" }, { status: 200 });
    response.cookies.set("authToken", token, { httpOnly: true, path: "/" });

    return response;
  } catch (error) {
    console.error("Login Error: ", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
