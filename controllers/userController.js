import twig from 'twig';

export function index(req, res) {
// Logic for user index page
const data = { name: 'John Doe' };
res.render('../views/index.html.twig', data);
}