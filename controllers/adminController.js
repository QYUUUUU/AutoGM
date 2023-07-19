export async function displayPannel(req, res) {
  if (req.session.userId != "undefined" && req.session.userId != ""  && req.session.userId != null && req.session.userId == 1){
    try {
        //Render OK
        res.render('../views/admin.html.twig');

    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing request");
    }
  }else{
    res.render('../views/login.html.twig');
  }
}