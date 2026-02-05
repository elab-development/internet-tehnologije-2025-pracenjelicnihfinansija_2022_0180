import bcrypt from 'bcrypt';
import { prisma } from '../prismaClient.js';
import {
  signToken,
  setAuthCookie,
  clearAuthCookie,
} from '../utils/authTokens.js';

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(409).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || '',
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    const token = signToken(user.id);
    setAuthCookie(res, token);

    return res.status(201).json({ user });
  } catch {
    return res.status(500).json({ message: 'Register failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user.id);
    setAuthCookie(res, token);

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch {
    return res.status(500).json({ message: 'Login failed' });
  }
};

export const logout = async (req, res) => {
  clearAuthCookie(res);
  return res.json({ message: 'Logged out' });
};

export const me = async (req, res) => {
  return res.json({ user: req.user });
};
