import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import jwt from "jsonwebtoken";

export async function GET(request) {
  const token = request.cookies.get("authToken");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let decodedToken = null;
  try {
    decodedToken = jwt.verify(token.value, process.env.JWT_SECRET);
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    const totalFollower = await prisma.follower.count({
      where: {
        followerId: decodedToken.userId,
      },
    });
    const totalFollowing = await prisma.follower.count({
      where: {
        followingId: decodedToken.userId,
      },
    });
    const totalPosts = await prisma.post.count({
      where: {
      userId:decodedToken.userId
      },
    });
    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.userId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "User data retrieved successfully",
        data: {
          totalFollower,
          totalFollowing,
          totalPosts,
          user,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database query failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve user data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
