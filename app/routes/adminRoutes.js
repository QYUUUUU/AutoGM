import { Router, json } from 'express';
const router = Router();
import { displayPannel } from '../controllers/adminController.js';

// Add middleware function to parse the request body as JSON
router.use(json());

// Add GET route for embedding
router.get('/pannel', displayPannel);


export default router;