var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
/* GET home page. */
router.get('/:jwt', function(req, res, next) {
    jwt.verify(req.params.jwt, '9B113DD29D8C85EDD7E15E182A1E8', function(err, decoded) {
        if (decoded.app_id === 'cb1cb94164a10fa702c09aa0f3e2fd3f8e77a73e'){
            res.json(decoded.app_name)
        }
    });
});

module.exports = router;
