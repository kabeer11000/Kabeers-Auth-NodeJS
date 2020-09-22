var express = require('express');
var router = express.Router();
const makeid = length => {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};
/* GET home page. */
router.get(['/', '/home', '/apps', '/profile'], function (req, res, next) {
  const file_name = 'api_views/react';
  res.render(file_name);
});
router.get('/app/callback', (req, res) => {
  res.back();
});
router.get('/app/start_oauthFlow', (req, res) => {
  res.redirect(`/auth/authorize?client_id=SS5s687df676k98d96ds9DWxsS8f0d9m791354&scope=AStroWorld_Cn9OuUNTZRfuaCnwc6:username&response_type=code&redirect_uri=${encodeURIComponent(req.protocol + '://' + req.get('host') + '/app/callback')}&state=${makeid(10)}&nonce=${makeid(10)}&prompt=${req.query.prompt || 'chooser'}`);
});


module.exports = router;
