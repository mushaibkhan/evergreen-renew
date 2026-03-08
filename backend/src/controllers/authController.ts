import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../utils/db';
import { v4 as uuidv4 } from 'uuid'; // requires UUID

const JWT_SECRET = process.env.JWT_SECRET || 'evergreen_super_secret_key_123!';

export const register = async (req: Request, res: Response) => {
    const { email, password, fullName, phoneNumber } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();
        const role = 'CUSTOMER';

        db.run(
            `INSERT INTO Users (id, email, passwordHash, fullName, phoneNumber, role) VALUES (?, ?, ?, ?, ?, ?)`,
            [id, email, hashedPassword, fullName, phoneNumber, role],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(409).json({ error: 'Email or phone already exists' });
                    }
                    return res.status(500).json({ error: err.message });
                }

                const token = jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '7d' });
                res.status(201).json({ message: 'User registered successfully', token, user: { id, email, fullName, role } });
            }
        );
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const login = (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get('SELECT * FROM Users WHERE email = ?', [email], async (err, user: any) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
            expiresIn: '7d',
        });

        res.json({ message: 'Login successful', token, user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role } });
    });
};
