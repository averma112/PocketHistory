import { prisma } from '@/lib/prisma'
import bcrypt from "bcrypt";

export async function POST(req) {
  const body = await req.json();
  const name = (body?.name || "").trim();
  const email = (body?.email || "").toLowerCase().trim();
  const password = body?.password || "";

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400 });
  }

  if (password.length < 8) {
    return new Response(JSON.stringify({ error: "Password must be at least 8 characters" }), { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return new Response(JSON.stringify({ error: "Email already in use" }), { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name: name || null, email, passwordHash },
    select: { id: true, email: true, name: true },
  });

  return new Response(JSON.stringify({ user }), { status: 201 });
}
