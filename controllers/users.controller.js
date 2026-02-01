import { prisma } from '../prismaClient.js';

export const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { id: 'desc' },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  res.json({ users });
};
