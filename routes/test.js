var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

Date.prototype.isValid = function () {

    // If the date object is invalid it
    // will return 'NaN' on getTime()
    // and NaN is never equal to itself.
    return this.getTime() === this.getTime();
};
router.get('/NANANA', function (req, res, next) {
    res.json(req.cookies);
});
/*
router.get('/:jwt', function (req, res, next) {
    jwt.verify(req.params.jwt, '9B113DD29D8C85EDD7E15E182A1E8', function (err, decoded) {
        if (err) {
            res.json('Token Expired')
        }
        if (decoded && decoded.app_id === 'cb1cb94164a10fa702c09aa0f3e2fd3f8e77a73e') {
            res.json(decoded.app_name)
        }
    });
});

router.get('/', function (req, res, next) {
    if (Math.floor((Date.now() - 1597139058479) / 1000) > 120) {
        res.json('Expired')
    } else {
        res.json('Valid');
    }
});
*/

module.exports = router;
