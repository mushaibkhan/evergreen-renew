import { Response } from 'express';
import prisma from '../utils/db';

export const updateDevice = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { basePrice, name } = req.body;

        const device = await prisma.device.update({
            where: { id },
            data: {
                basePrice: basePrice !== undefined ? parseFloat(basePrice) : undefined,
                name: name || undefined
            },
        });

        res.json({ message: 'Device updated successfully', device });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const updateQuestionOption = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { label, priceDeduction, percentageDeduction } = req.body;

        const option = await prisma.questionOption.update({
            where: { id },
            data: {
                label: label || undefined,
                priceDeduction: priceDeduction !== undefined ? parseFloat(priceDeduction) : undefined,
                percentageDeduction: percentageDeduction !== undefined ? parseFloat(percentageDeduction) : undefined
            },
        });

        res.json({ message: 'Option updated successfully', option });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getAdminStats = async (req: any, res: Response): Promise<void> => {
    try {
        const totalOrders = await prisma.order.count();

        const completedOrders = await prisma.order.findMany({
            where: { status: 'COMPLETED' },
            include: { quote: { select: { offeredPrice: true } } }
        });
        const revenue = completedOrders.reduce((acc, curr) => acc + (curr.quote?.offeredPrice || 0), 0);

        const activeQuotes = await prisma.quote.count({
            where: { status: 'PENDING_CHECKOUT' }
        });

        const totalUsers = await prisma.user.count({
            where: { role: 'CUSTOMER' }
        });

        res.json({
            totalOrders,
            totalValue: revenue,
            activeQuotes,
            totalUsers
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
