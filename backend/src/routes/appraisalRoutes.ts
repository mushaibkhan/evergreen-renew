import { Router } from 'express';
import { getDeviceQuestions, evaluateQuote } from '../controllers/appraisalController';

const router = Router();

// Get questions specific to a device/category
router.get('/:deviceId/questions', getDeviceQuestions);

// Submit condition evaluations to receive an instant price quote
router.post('/evaluate', evaluateQuote);

export default router;
