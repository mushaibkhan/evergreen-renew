import { Router } from 'express';
import { updateDevice, updateQuestionOption, getAdminStats } from '../controllers/adminController';
import { authenticateJWT, isAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateJWT);
router.use(isAdmin);

router.get('/stats', getAdminStats);
router.patch('/devices/:id', updateDevice);
router.patch('/options/:id', updateQuestionOption);

export default router;
