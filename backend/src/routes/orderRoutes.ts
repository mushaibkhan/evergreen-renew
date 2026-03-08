import { Router } from 'express';
import { createOrder, getUserOrders } from '../controllers/orderController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

// Protect order routes with JWT
router.use(authenticateJWT);

router.post('/', createOrder);
router.get('/my-orders', getUserOrders);

export default router;
