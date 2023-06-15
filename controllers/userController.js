import twig from 'twig';

export function index(req, res) {
    // Logic for user index page
    const data = { name: 'John Doe' };
    console.log(req.session.userId)
    if (req.session.userId != "undefined" && req.session.userId != ""  && req.session.userId != null){
        res.render('../views/index.html.twig', data);
    }else{
        res.render('../views/login.html.twig');
      }
}