import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET() {
    
    try {
     const posts = await prisma.post.findMany();
    return NextResponse.json(
        {
          sucess: true,
          message: "List Data Posts",
          data: posts,
        },
        {
          status: 200,
        }
      );
 } catch (error) {
    return NextResponse.json(
        {
          sucess: false,
          message: "List Data Posts",
          data: error,
        },
        {
          status: 200,
        }
      );
 }
}
export async function POST(request) {
    try {
      // Mengambil data dari body request
      const { title, content } = await request.json();
  
      // Validasi input
      if (!title || !content) {
        return NextResponse.json(
          {
            success: false,
            message: 'Title and content are required.',
          },
          { status: 400 } // Bad Request
        );
      }
  
      // Membuat post baru
      const post = await prisma.post.create({
        data: {
          title,
          content,
        },
      });
  
      console.log(post);
  
      return NextResponse.json(
        {
          success: true,
          message: 'Post Created Successfully!',
          data: post,
        },
        { status: 201 } // Created
      );
    } catch (error) {
      
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          error: error.message,
        },
        { status: 500 } // Internal Server Error
      );
    }
  }
