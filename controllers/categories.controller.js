import { prisma } from '../prismaClient.js';

export const getAllCategories = async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
  res.json({ categories });
};

export const getCategoryById = async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return res.status(404).json({ message: 'Category not found' });

  res.json({ category });
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim())
      return res.status(400).json({ message: 'Name is required' });

    const category = await prisma.category.create({
      data: { name: name.trim() },
    });

    res.status(201).json({ category });
  } catch (err) {
    return res.status(409).json({ message: 'Category already exists' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id))
      return res.status(400).json({ message: 'Invalid id' });

    const { name } = req.body;
    if (!name?.trim())
      return res.status(400).json({ message: 'Name is required' });

    const category = await prisma.category.update({
      where: { id },
      data: { name: name.trim() },
    });

    res.json({ category });
  } catch (err) {
    if (String(err?.code) === 'P2025') {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.status(409).json({ message: 'Category name already exists' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id))
      return res.status(400).json({ message: 'Invalid id' });

    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    if (String(err?.code) === 'P2025') {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.status(500).json({ message: 'Delete failed' });
  }
};
