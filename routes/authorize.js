let express, router, mongo, path, MongoClient, url, jwt, mongo_uri, grant_types_index;
express = require('express');
router = express.Router();
mongo = require('mongodb');
path = require('path');
MongoClient = mongo.MongoClient;
url = require('url');
jwt = require('jsonwebtoken');
mongo_uri = require('.././keys/mongo_key');
grant_types_index = {
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

function getAppCookies(req, res) {
    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookies = {};
    rawCookies.forEach(rawCookie => {
        const parsedCookie = rawCookie.split('=');
        parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });
    return parsedCookies;
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


router.get('/authorize/:app_id/:callback/:grant_type/:state', function (req, res, next) {
    if (!req.params.app_id || !req.params.callback || !req.params.grant_type || !req.params.state) {
        res.json('Some Params Were Missing, Bad Request');
        throw new Error('Some Params Were Missing');
    }
    const
        app_id = decodeURIComponent(req.params.app_id),
        grant_type = decodeURIComponent(req.params.grant_type),
        callback = url.parse(decodeURIComponent(req.params.callback)),
        remote_app_id = 'A5YWEwZjNlMmZkM2Y4ZTc3YTczZSI',
        state = req.params.state;

    MongoClient.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) {
            res.json('Cannot Connect to DB');
        }
        let dbo = db.db("auth");
        dbo.collection("clients_app").findOne({app_id: app_id}, function (err, result) {
            if (err) res.json(err);
            if (result && url.parse(result.callback_domain).host === callback.host && grant_type === 'auth_code') {
                const authCode_id = makeid(13);

                const json = {
                    auth_code: authCode_id,
                    app_id: app_id,
                    remote_app_id: remote_app_id,
                    time: Date.now(),
                    expires: '2M',
                    callback: result.callback_domain,
                    state: req.params.state,
                };
//                req.session.authCode = json;
                res.render('allow_access', {
                    app_name: result.name,
                    grant_types_ui: 'Basic Info Including Email and Username',
                    callback: result.callback_domain,
                    code: authCode_id,
                    state: req.params.state,
                });
                const token = jwt.sign({
                    ...json
                }, 'kabeersnetwork', {expiresIn: '1h'});
                res.cookie('bearer', token, {
                    httpOnly: false
                });
                res.cookie('bearer-token', token, {
                    httpOnly: true
                });/*
                const authCode_id = makeid(13);
                const json = {
                    auth_code: authCode_id,
                    app_id: app_id,
                    remote_app_id: remote_app_id,
                    time: Date.now(),
                    expires: '2M',
                };
                req.session.authCode = json;
                //res.json(`${decodeURIComponent(req.params.callback)}?code=${authCode_id}&state=${state}`);
                res.render('allow_access', {
                    app_name: result.name,
                    grant_types_ui: 'Basic Info Including Email and Username',
                    callback: result.callback_domain,
                    code: authCode_id,
                    state: req.params.state,
                });
*/
                //res.redirect(`${decodeURIComponent(req.params.callback)}?code=${authCode_id}&state=${state}`);
            } else {
                res.json('Bad Request')
            }
        });
    });
});
router.post('/authorize', (req, res) => {

    if (!req.body.username || !req.body.password) {
        res.json('Some Params Were Missing, Bad Request');
        throw new Error('Some Params Were Missing');
    }
    const
        username = req.body.username,
        password = req.body.password,
        token = getAppCookies(req, res)['bearer-token'];

    MongoClient.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) {
            res.json('Cannot Connect to DB');
        }
        let dbo = db.db("auth");
        dbo.collection("users").findOne({username: username, password: password}, function (err, result) {
            if (err) res.json(err);
            if (result && token) {
                const id_token = jwt.sign({
                    user_id: result.user_id,
                }, 'kabeersnetwork', {expiresIn: '2m'});

                res.cookie('bearer', token, {
                    httpOnly: false
                });
                res.cookie('id-token', id_token, {
                    httpOnly: false
                });
                const json_data = jwt.decode(getAppCookies(req, res)['bearer-token']);
                res.redirect(`${decodeURIComponent(json_data.callback)}?code=${json_data.auth_code}&token=${id_token}&state=${json_data.state}`);
            } else {
                res.json('Bad Request')
            }
        });
    });
});

module.exports = router;
