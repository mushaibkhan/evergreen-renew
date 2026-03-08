import { Request, Response } from 'express';
import db from '../utils/db';

export const getCategories = (req: Request, res: Response) => {
    db.all('SELECT * FROM Categories', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

export const getBrandsByCategory = (req: Request, res: Response) => {
    const { categoryId } = req.params;
    db.all('SELECT * FROM Brands WHERE categoryId = ?', [categoryId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

export const getDevicesByBrand = (req: Request, res: Response) => {
    const { brandId } = req.params;
    db.all('SELECT * FROM Devices WHERE brandId = ?', [brandId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

export const getDeviceDetails = (req: Request, res: Response) => {
    const { slug } = req.params;
    db.get('SELECT * FROM Devices WHERE slug = ?', [slug], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Device not found' });
        }
        res.json(row);
    });
};
