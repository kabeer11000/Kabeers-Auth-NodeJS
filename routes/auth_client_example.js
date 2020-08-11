const express = require('express'),
    router = express.Router(),
    mongo = require('mongodb'),
    path = require('path'),
    MongoClient = mongo.MongoClient,
    url = require('url'),
    jwt = require('jsonwebtoken');
var mongo_uri = require('.././keys/mongo_key');

const grant_types_index = {
    'email': {
        title: 'Email Address.',
        description: 'Public Email Address for This Account.',
    },
    'account_image': {
        title: 'Account Image and Avatar',
        description: 'Account Profile Picture',
    },
    'basic_info': {
        title: 'Basic Info Including Locale and IP',
        description: 'View Basic Account Info',
    },
};

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


router.post('/', function (req, res, next) {
    let array_checker = (arr, target) => target.every(v => arr.includes(v));
    if (!req.body.app_id || !req.body.callback || !req.body.grant_types || !req.body.username || !req.body.password) {
        res.json('Some Params Were Missing, Bad Request');
        throw new Error('Some Params Were Missing');
    }
    const
        app_id = decodeURIComponent(req.body.app_id),
        grant_types = decodeURIComponent(req.body.grant_types).split(':'),
        callback = url.parse(decodeURIComponent(req.body.callback)),
        password = req.body.password,
        username = req.body.username,
        token = req.body.token;
    jwt.verify(token, 'HLRnfT8Ri6Oe5kf4tiNTv1S4VGhCA', {}, function (err, decoded) {
        if (err) {
            res.json('Token Expired');
        }
        if (decoded) {
            if (!decoded.grant_types || !array_checker(decoded.grant_types, grant_types)) {
                res.json('Invalid Grant Types');
                throw new Error('Invalid Grant Types');
            }
            MongoClient.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
                if (err) {
                    res.json('Cannot Connect to DB');
                }
                let dbo = db.db("auth");
                dbo.collection("users").findOne({
                    username: req.body.username,
                    password: req.body.password
                }, function (err, result) {
                    if (err) res.json(err);
                    if (result) {
                        const user_result = {
                            username: result.username,
                            email: result.email,
                            user_id: result.user_id,
                            account_image: result.account_image
                        };
                        let user_data = {};
                        grant_types.forEach((v_, i) => {
                            user_data[v_] = user_result[v_];
                        });
                        res.json(user_data);
                    } else {
                        res.json('Bad Request')
                    }
                });
            });
        }
    });
});
router.get('/:app_id/:callback/:grant_types/:token', function (req, res, next) {
    let array_checker = (arr, target) => target.every(v => arr.includes(v));
    if (!req.params.app_id || !req.params.callback || !req.params.grant_types) {
        res.json('Some Params Were Missing, Bad Request');
        throw new Error('Some Params Were Missing');
    }
    const
        app_id = decodeURIComponent(req.params.app_id),
        grant_types = decodeURIComponent(req.params.grant_types).split(':'),
        callback = url.parse(decodeURIComponent(req.params.callback)),
        token = req.params.token;
    jwt.verify(token, 'HLRnfT8Ri6Oe5kf4tiNTv1S4VGhCA', {}, function (err, decoded) {
        if (err) {
            res.json('Token Expired');
        }
        if (decoded) {
            if (!decoded.grant_types || !array_checker(decoded.grant_types, grant_types)) {
                res.json('Invalid Grant Types');
                throw new Error('Invalid Grant Types');
            } else {
                res.render('auth_client_example', {
                    app_name: decoded.app_name,
                    grant_types_ui: '${}',
                    grant_types: grant_types,
                    app_id: app_id,
                    token: token
                });
//                res.sendFile(path.join(__dirname, '.././views/auth_client_example.hbs'));
            }
        }
    });
});

router.get('/', (req, res, next) => res.json('Nothing Here'));

module.exports = router;
