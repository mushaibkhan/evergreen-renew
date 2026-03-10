import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/db';

const JWT_SECRET = process.env.JWT_SECRET || 'evergreen_super_secret_key_123!';

export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, fullName, phoneNumber } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }

    try {
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, ...(phoneNumber ? [{ phoneNumber }] : [])] },
        });

        if (existingUser) {
            res.status(409).json({ error: 'Email or phone already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                fullName,
                phoneNumber,
                role: 'CUSTOMER',
            },
        });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
