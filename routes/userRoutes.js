import { Router } from 'express';
const router = Router();
import { index } from '../controllers/userController.js';
import twig from 'twig';

router.get('/', index, (req, res) => {
// Render the Twig view
res.render('../views/index.html.twig', { name: 'John Doe' });
});

export default router;