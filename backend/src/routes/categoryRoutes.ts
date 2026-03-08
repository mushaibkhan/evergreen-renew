import { Router } from 'express';
import { getCategories, getBrandsByCategory, getDevicesByBrand, getDeviceDetails } from '../controllers/categoryController';

const router = Router();

router.get('/', getCategories);
router.get('/:categoryId/brands', getBrandsByCategory);
router.get('/brands/:brandId/devices', getDevicesByBrand);
router.get('/device/:slug', getDeviceDetails);

export default router;
