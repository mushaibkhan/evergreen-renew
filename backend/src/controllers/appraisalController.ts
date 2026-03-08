import { Request, Response } from 'express';
import db from '../utils/db';

export const getDeviceQuestions = (req: Request, res: Response) => {
    const { deviceId } = req.params;

    // Selsmart Mock Evaluation Questions Flow
    const questions = [
        {
            id: 'q1',
            text: 'Does your device switch on?',
            type: 'YES_NO',
            options: [
                { id: 'opt1_y', label: 'Yes', priceDeduction: 0 },
                { id: 'opt1_n', label: 'No', priceDeduction: 10000 }
            ]
        },
        {
            id: 'q2',
            text: 'Are there any scratches on the screen?',
            type: 'MULTIPLE_CHOICE',
            options: [
                { id: 'opt2_none', label: 'Flawless', priceDeduction: 0 },
                { id: 'opt2_minor', label: 'Minor Scratches', priceDeduction: 1500 },
                { id: 'opt2_heavy', label: 'Heavy Scratches / Cracked', priceDeduction: 4500 }
            ]
        }
    ];

    // In a real DB scenario, we would map `deviceId` -> `categoryId` 
    // -> `Questionnaire` -> `Questions`. Returning mock here for scoping speed.
    res.json({ deviceId, questions });
};

export const evaluateQuote = (req: Request, res: Response) => {
    const { deviceId, selectedOptions } = req.body;
    // selectedOptions = [{ questionId: 'q1', optionId: 'opt1_y' }, ...]

    db.get('SELECT basePrice FROM Devices WHERE id = ?', [deviceId], (err, row: any) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Device not found' });

        let finalPrice = row.basePrice;

        // A simplified mock deduction logic matching Selsmart flow
        // A fully scaled system would query QuestionOption table via IDs to map `priceDeduction`.

        // Hardcoded deduction map for simulation:
        const mockDeductions: Record<string, number> = {
            'opt1_n': 10000,
            'opt2_minor': 1500,
            'opt2_heavy': 4500
        };

        if (Array.isArray(selectedOptions)) {
            selectedOptions.forEach((opt: any) => {
                if (mockDeductions[opt.optionId]) {
                    finalPrice -= mockDeductions[opt.optionId];
                }
            });
        }

        // Ensure price doesn't drop below 0
        finalPrice = Math.max(0, finalPrice);

        res.json({
            deviceId,
            basePrice: row.basePrice,
            offeredPrice: finalPrice,
            quoteId: `quote_${Date.now()}` // Mock quote generation
        });
    });
};
