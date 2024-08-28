import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '../../../../../prisma/client';

export async function POST(request) {
  const { username, email, name, password } = await request.json();

  
  if (!username || !email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }


  let existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
  }
  existingUser= await prisma.user.findUnique({where:{username} })
  if (existingUser) {
    return NextResponse.json({ error: 'Username already exist' }, { status: 400 });
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Buat pengguna baru
  const user = await prisma.user.create({
    data: {
      username,
      email,
      name,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}
