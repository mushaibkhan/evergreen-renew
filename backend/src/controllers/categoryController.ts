import { Request, Response } from 'express';
import prisma from '../utils/db';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
        res.json(categories);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getBrandsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId } = req.params;
        const brands = await prisma.brand.findMany({
            where: { categoryId },
            orderBy: { name: 'asc' },
        });
        res.json(brands);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getDevicesByBrand = async (req: Request, res: Response): Promise<void> => {
    try {
        const { brandId } = req.params;
        const devices = await prisma.device.findMany({
            where: { brandId },
            include: { brand: true, category: true },
            orderBy: { name: 'asc' },
        });
        res.json(devices);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getDeviceDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const device = await prisma.device.findUnique({
            where: { slug },
            include: { brand: true, category: true },
        });
        if (!device) {
            res.status(404).json({ error: 'Device not found' });
            return;
        }
        res.json(device);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
