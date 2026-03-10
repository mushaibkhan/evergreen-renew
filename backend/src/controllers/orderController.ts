import { Response } from 'express';
import prisma from '../utils/db';

export const createOrder = async (req: any, res: Response): Promise<void> => {
    try {
        const { quoteId, pickupDate, timeSlot, pickupAddressId, paymentMethod } = req.body;
        const userId = req.user.id;

        if (!quoteId || !pickupDate || !timeSlot) {
            res.status(400).json({ error: 'Missing required order fields' });
            return;
        }

        const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
        if (!quote) {
            res.status(404).json({ error: 'Quote not found' });
            return;
        }
        if (quote.status !== 'PENDING_CHECKOUT') {
            res.status(400).json({ error: 'Quote is no longer valid' });
            return;
        }

        const order = await prisma.order.create({
            data: {
                userId,
                quoteId,
                pickupAddressId,
                pickupDate: new Date(pickupDate),
                timeSlot,
                paymentMethod: paymentMethod || 'Cash',
                status: 'SCHEDULED',
                paymentStatus: 'PENDING',
            },
        });

        await prisma.quote.update({
            where: { id: quoteId },
            data: { status: 'ACCEPTED' },
        });

        res.status(201).json({
            message: 'Order created successfully. Pickup scheduled.',
            orderId: order.id,
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getUserOrders = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;

        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                quote: {
                    include: { device: { include: { brand: true, category: true } } },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(orders);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getAllOrders = async (req: any, res: Response): Promise<void> => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: { select: { fullName: true, email: true, phoneNumber: true } },
                quote: {
                    include: { device: { include: { brand: true, category: true } } },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(orders);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const updateOrderStatus = async (req: any, res: Response): Promise<void> => {
    try {
        const { orderId } = req.params;
        const { status, paymentStatus } = req.body;

        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: status || undefined,
                paymentStatus: paymentStatus || undefined
            },
        });

        res.json({ message: 'Order updated successfully', order });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
