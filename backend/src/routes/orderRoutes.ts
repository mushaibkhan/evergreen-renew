import { Router } from 'express';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController';
import { authenticateJWT, isAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Protect order routes with JWT
router.use(authenticateJWT);

router.post('/', createOrder);
router.get('/my-orders', getUserOrders);

// Admin-only routes
router.get('/admin/all', isAdmin, getAllOrders);
router.patch('/admin/:orderId', isAdmin, updateOrderStatus);

export default router;
