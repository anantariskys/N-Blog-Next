import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import jwt from "jsonwebtoken";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';


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
        userId: decodedToken.userId,
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


const firebaseConfig = {
  apiKey: "AIzaSyBLkxzcsv-grj9UxTiKJ2rp8fdoPG39vfc",
  authDomain: "n-blog-next.firebaseapp.com",
  projectId: "n-blog-next",
  storageBucket: "n-blog-next.appspot.com",
  messagingSenderId: "800664885227",
  appId: "1:800664885227:web:e9c61f6f6aee693e89abae",
  measurementId: "G-5KFPC3L7CQ"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function PUT(request) {
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
    const formData = await request.formData();
    
    const allowedUpdates = ['name', 'username', 'bio', 'image'];
    
    const updates = {};

    
    for (const key of allowedUpdates) {
      if (formData.has(key)) {
        if (key === 'image') {
          const file = formData.get(key);
          if (file && file.size > 0) {
            const fileName = `${uuidv4()}-${file.name}`;
            const imageRef = ref(storage, `profile-images/${fileName}`);
           const result =  await uploadBytes(imageRef, file);
            console.log(result)
            const downloadURL = await getDownloadURL(imageRef);
            updates[key] = downloadURL;
            console.log(downloadURL)
          }
        } else {
          updates[key] = formData.get(key);
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid update fields provided" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: decodedToken.userId,
      },
      data: updates,
    });
    return NextResponse.json(
      {
        success: true,
        message: "User data updated successfully",
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}