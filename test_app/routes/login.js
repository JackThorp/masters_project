var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('Login');
});

router.post('/', function (req, res) {
  req.session.globalPassword = req.body.password;
  console.log("password set globally");

  backURL=req.header('Referer') || '/';
  res.redirect(backURL);
});

module.exports = router;
