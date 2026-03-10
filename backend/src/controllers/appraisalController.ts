import { Request, Response } from 'express';
import prisma from '../utils/db';

export const getDeviceQuestions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { deviceId } = req.params;

        const device = await prisma.device.findUnique({
            where: { id: deviceId },
            select: {
                id: true,
                name: true,
                basePrice: true,
                categoryId: true,
            },
        });

        if (!device) {
            res.status(404).json({ error: 'Device not found' });
            return;
        }

        const questionnaires = await prisma.questionnaire.findMany({
            where: { categoryId: device.categoryId },
            include: {
                questions: {
                    include: { options: true },
                },
            },
        });

        const questions = questionnaires.length > 0 ? questionnaires[0].questions : [];

        res.json({ deviceId: device.id, deviceName: device.name, basePrice: device.basePrice, questions });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const evaluateQuote = async (req: Request, res: Response): Promise<void> => {
    try {
        const { deviceId, selectedOptionIds } = req.body;

        const device = await prisma.device.findUnique({ where: { id: deviceId } });
        if (!device) {
            res.status(404).json({ error: 'Device not found' });
            return;
        }

        let totalDeduction = 0;

        if (Array.isArray(selectedOptionIds) && selectedOptionIds.length > 0) {
            const optionIds: string[] = selectedOptionIds;
            const options = await prisma.questionOption.findMany({
                where: { id: { in: optionIds } },
            });

            for (const opt of options) {
                if (opt.percentageDeduction) {
                    totalDeduction += (device.basePrice * opt.percentageDeduction) / 100;
                } else {
                    totalDeduction += opt.priceDeduction;
                }
            }
        }

        const offeredPrice = Math.max(0, device.basePrice - totalDeduction);

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const quote = await prisma.quote.create({
            data: {
                deviceId,
                offeredPrice,
                conditionAnswers: selectedOptionIds ?? [],
                status: 'PENDING_CHECKOUT',
                expiresAt,
            },
        });

        res.json({
            quoteId: quote.id,
            deviceId,
            basePrice: device.basePrice,
            totalDeduction,
            offeredPrice,
            expiresAt: quote.expiresAt,
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
