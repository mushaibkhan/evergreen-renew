import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

import categoryRoutes from './routes/categoryRoutes';
import appraisalRoutes from './routes/appraisalRoutes';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';

app.use('/api/categories', categoryRoutes);
app.use('/api/quotes', appraisalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', message: 'Evergreen Renew API is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
