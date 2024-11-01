// pages/api/users.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { calculateAge } from '@/utils/ageCount';
import prisma from '@/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const users = await prisma.user.findMany();

  const usersWithAge = users.map((user: { birth_date: any; }) => ({
    ...user,
    age: calculateAge(user.birth_date),
  }));

  res.json(usersWithAge);
}
