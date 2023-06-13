import { Router, json } from 'express';
const router = Router();
import { getEmbedding } from '../controllers/backendController.js';
import { Agentcall } from '../controllers/agentController.js';

// Add middleware function to parse the request body as JSON
router.use(json());

// Add GET route for embedding
router.get('/embedding', getEmbedding);

// Add POST route for Agent
router.post('/agent', Agentcall);

export default router;