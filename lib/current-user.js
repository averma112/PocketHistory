import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id;
  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) return user;
  }

  const email = session?.user?.email?.toLowerCase().trim();
  if (!email) return null;

  return prisma.user.findUnique({ where: { email } });
}
