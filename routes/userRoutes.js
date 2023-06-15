import { Router } from 'express';
import { index } from '../controllers/userController.js';
import twig from 'twig';

const router = Router();

router.get('/', index, (req, res) => {
  if (req.session.userId != "undefined" && req.session.userId != ""  && req.session.userId != null){
    res.render('../views/index.html.twig');
  }else{
    res.render('../views/login.html.twig');
  }
});

// Render the login page
router.get('/login', (req, res) => {
  console.log(req.session.userId)
  res.render('../views/login.html.twig');
});

// Render the register page
router.get('/register', (req, res) => {
  res.render('../views/register.html.twig');
});

export default router;