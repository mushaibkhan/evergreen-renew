import { Request, Response } from 'express';
import db from '../utils/db';
import { v4 as uuidv4 } from 'uuid';

// In a real scenario, `req` would be extended via `AuthRequest` interface
export const createOrder = (req: any, res: Response) => {
    const { quoteId, pickupDate, timeSlot, pickupAddressId, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!quoteId || !pickupDate || !timeSlot) {
        return res.status(400).json({ error: 'Missing required order fields' });
    }

    const orderId = uuidv4();

    // Create order via SQLite
    db.run(
        `INSERT INTO Orders (id, userId, quoteId, pickupAddressId, pickupDate, timeSlot, paymentMethod)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, userId, quoteId, pickupAddressId || null, pickupDate, timeSlot, paymentMethod || 'Cash'],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: 'Order created successfully. Pickup scheduled.',
                orderId
            });
        }
    );
};

export const getUserOrders = (req: any, res: Response) => {
    const userId = req.user.id;

    db.all('SELECT * FROM Orders WHERE userId = ? ORDER BY createdAt DESC', [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};
