import { Router, json } from 'express';
const router = Router();
import { displayPannel, updateWorldState } from '../controllers/adminController.js';

router.use(json());

router.get('/pannel', displayPannel);
router.post('/world-state', updateWorldState);

export default router;
