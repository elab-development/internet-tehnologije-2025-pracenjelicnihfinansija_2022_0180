import { prisma } from '../prismaClient.js';
import { getCurrentYearMonth, parseYearMonth } from '../utils/dateParts.js';
import { parseIntId } from '../utils/parse.js';

export const getMyMonthlyLimit = async (req, res) => {
  const q = parseYearMonth(req.query.year, req.query.month);
  const { year, month } = q || getCurrentYearMonth();

  const limit = await prisma.monthlyLimit.findUnique({
    where: { userId_year_month: { userId: req.user.id, year, month } },
  });

  res.json({ monthlyLimit: limit });
};

export const upsertMyMonthlyLimit = async (req, res) => {
  if (req.user.role !== 'USER') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const q = parseYearMonth(req.query.year, req.query.month);
  const { year, month } = q || getCurrentYearMonth();

  const { amount } = req.body;

  if (amount === undefined || amount === null) {
    return res.status(400).json({ message: 'Amount is required' });
  }

  const parsedAmount = Number(amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return res
      .status(400)
      .json({ message: 'Amount must be a positive number' });
  }

  const limit = await prisma.monthlyLimit.upsert({
    where: { userId_year_month: { userId: req.user.id, year, month } },
    create: { userId: req.user.id, year, month, amount: parsedAmount },
    update: { amount: parsedAmount },
  });

  await prisma.user.update({
    where: { id: req.user.id },
    data: { monthly_limit: parsedAmount },
  });

  res.status(201).json({ monthlyLimit: limit });
};

export const deleteMyMonthlyLimit = async (req, res) => {
  if (req.user.role !== 'USER') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const q = parseYearMonth(req.query.year, req.query.month);
  const { year, month } = q || getCurrentYearMonth();

  const existing = await prisma.monthlyLimit.findUnique({
    where: { userId_year_month: { userId: req.user.id, year, month } },
    select: { id: true },
  });

  if (!existing)
    return res.status(404).json({ message: 'Monthly limit not found' });

  await prisma.monthlyLimit.delete({
    where: { id: existing.id },
  });

  res.json({ message: 'Monthly limit deleted' });
};

/**
 * Admin-only: pregled limita za nekog korisnika
 */
export const adminGetUserMonthlyLimits = async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const userId = parseIntId(req.params.userId);
  if (!userId) return res.status(400).json({ message: 'Invalid userId' });

  const limits = await prisma.monthlyLimit.findMany({
    where: { userId },
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
  });

  res.json({ monthlyLimits: limits });
};
