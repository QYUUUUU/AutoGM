import { Router, json } from 'express';
const router = Router();
import { displayPannel, updateWorldState, listAdversaries, createAdversary, deleteAdversary } from '../controllers/adminController.js';

router.use(json());

router.get('/pannel', displayPannel);
router.post('/world-state', updateWorldState);

router.get('/adversaries', listAdversaries);
router.post('/adversaries', createAdversary);
router.post('/adversaries/delete/:id', deleteAdversary);

export default router;
