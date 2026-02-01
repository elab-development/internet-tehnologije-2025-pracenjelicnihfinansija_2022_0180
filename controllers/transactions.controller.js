import { prisma } from '../prismaClient.js';
import { parseIntId } from '../utils/parse.js';

export const getTransactions = async (req, res) => {
  const isAdmin = req.user.role === 'ADMIN';

  const where = isAdmin ? {} : { userId: req.user.id };

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: 'desc' },
    include: {
      category: true,
      user: { select: { id: true, email: true, name: true, role: true } },
    },
  });

  res.json({ transactions });
};

export const getTransactionById = async (req, res) => {
  const id = parseIntId(req.params.id);
  if (!id) return res.status(400).json({ message: 'Invalid id' });

  const tx = await prisma.transaction.findUnique({
    where: { id },
    include: {
      category: true,
      user: { select: { id: true, email: true, name: true, role: true } },
    },
  });

  if (!tx) return res.status(404).json({ message: 'Transaction not found' });

  const isAdmin = req.user.role === 'ADMIN';
  const isOwner = tx.userId === req.user.id;

  if (!isAdmin && !isOwner) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  res.json({ transaction: tx });
};

export const createTransaction = async (req, res) => {
  if (req.user.role !== 'USER') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { amount, type, date, description, categoryId } = req.body;

  if (amount === undefined || amount === null) {
    return res.status(400).json({ message: 'Amount is required' });
  }

  const parsedAmount = Number(amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return res
      .status(400)
      .json({ message: 'Amount must be a positive number' });
  }

  if (type !== 'INCOME' && type !== 'EXPENSE') {
    return res.status(400).json({ message: 'Type must be INCOME or EXPENSE' });
  }

  const catId = parseIntId(categoryId);
  if (!catId)
    return res.status(400).json({ message: 'categoryId is required' });

  const category = await prisma.category.findUnique({ where: { id: catId } });
  if (!category) return res.status(404).json({ message: 'Category not found' });

  const tx = await prisma.transaction.create({
    data: {
      userId: req.user.id,
      categoryId: catId,
      type,
      amount: parsedAmount,
      date: date ? new Date(date) : undefined,
      description: description?.trim() || null,
    },
    include: { category: true },
  });

  res.status(201).json({ transaction: tx });
};

export const updateTransaction = async (req, res) => {
  if (req.user.role !== 'USER') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const id = parseIntId(req.params.id);
  if (!id) return res.status(400).json({ message: 'Invalid id' });

  const existing = await prisma.transaction.findUnique({ where: { id } });
  if (!existing)
    return res.status(404).json({ message: 'Transaction not found' });

  if (existing.userId !== req.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { amount, type, date, description, categoryId } = req.body;

  const data = {};

  if (amount !== undefined) {
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res
        .status(400)
        .json({ message: 'Amount must be a positive number' });
    }
    data.amount = parsedAmount;
  }

  if (type !== undefined) {
    if (type !== 'INCOME' && type !== 'EXPENSE') {
      return res
        .status(400)
        .json({ message: 'Type must be INCOME or EXPENSE' });
    }
    data.type = type;
  }

  if (date !== undefined) data.date = date ? new Date(date) : existing.date;
  if (description !== undefined) data.description = description?.trim() || null;

  if (categoryId !== undefined) {
    const catId = parseIntId(categoryId);
    if (!catId) return res.status(400).json({ message: 'Invalid categoryId' });

    const category = await prisma.category.findUnique({ where: { id: catId } });
    if (!category)
      return res.status(404).json({ message: 'Category not found' });

    data.categoryId = catId;
  }

  const tx = await prisma.transaction.update({
    where: { id },
    data,
    include: { category: true },
  });

  res.json({ transaction: tx });
};

export const deleteTransaction = async (req, res) => {
  if (req.user.role !== 'USER') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const id = parseIntId(req.params.id);
  if (!id) return res.status(400).json({ message: 'Invalid id' });

  const existing = await prisma.transaction.findUnique({ where: { id } });
  if (!existing)
    return res.status(404).json({ message: 'Transaction not found' });

  if (existing.userId !== req.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await prisma.transaction.delete({ where: { id } });
  res.json({ message: 'Transaction deleted' });
};
