const express = require('express'),
    router = express.Router(),
    mongo = require('mongodb'),
    path = require('path'),
    MongoClient = mongo.MongoClient,
    url = require('url'),
    jwt = require('jsonwebtoken'),
    mongo_uri = require('.././keys/mongo_key'),
    grant_types_index = {
        username: {
            title: 'Account Username.',
            description: 'Public Username for This Account.',
        },
        email: {
            title: 'Email Address.',
            description: 'Public Email Address for This Account.',
        },
        account_image: {
            title: 'Account Image and Avatar',
            description: 'Account Profile Picture',
        },
        basic_info: {
            title: 'Basic Info Including Locale and IP',
            description: 'View Basic Account Info',
        },
    };
let jwt_secret = makeid(30);
let array_checker = (arr, target) => target.every(v => arr.includes(v));
var refreshTokens = {};

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

router.get('/authorize', (req, res) => {
    res.json({
        authenticate_app: {
            endpoint: "/authorize/:app_id/:callback/:grant_types/:state"
        }
    })
});

router.get('/authorize/:app_id/:callback/:grant_types/:state/?', function (req, res, next) {
    if (!req.params.app_id || !req.params.callback || !req.params.grant_types || !req.params.state) {
        res.json('Some Params Were Missing, Bad Request');
        throw new Error('Some Params Were Missing');
    }
    const
        app_id = decodeURIComponent(req.params.app_id),
        grant_types = decodeURIComponent(req.params.grant_types),
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
            if (result && url.parse(result.callback_domain).host === callback.host) {
                const authCode_id = makeid(13);

                const json = {
                    auth_code: authCode_id,
                    app_id: app_id,
                    remote_app_id: remote_app_id,
                    time: Date.now(),
                    expires: '2M',
                    callback: result.callback_domain,
                    state: req.params.state,
                    grant_types: req.params.grant_types,
                };
                const gtypes_split = grant_types.split(':');
                if (!array_checker("email:username:account_image:user_id".split(':'), gtypes_split)) {
                    res.json('Invalid Grant Types');
                } else {
                    let grant_ui = [], html = ``;
                    grant_types.split(':').map((v, i) => {
                        grant_ui.push(grant_types_index[v]);
                    });
                    grant_ui.map((v) => {
                        html += `<li class="list-group-item">${v.title}<br/><small class="text-muted">${v.description}</small></li>`;
                    });
                    const default_account = getAppCookies(req, res)['default_account'] != null || undefined ? JSON.parse(decodeURIComponent(getAppCookies(req, res)['default_account'])) : "";
                    if (default_account) {
                        res.render('allow_acces_default_account.hbs', {
                            username_: default_account.username,
                            password_: default_account.password,
                            profile_img: default_account.account_image,
                            app_name: result.name,
                            grant_types_ui: html,
                            callback: result.callback_domain,
                            code: authCode_id,
                            state: req.params.state,
                        });
                    } else {
                        res.render('allow_acces_password', {
                            app_name: result.name,
                            grant_types_ui: 'Basic Info Including Email and Username',
                            callback: result.callback_domain,
                            code: authCode_id,
                            state: req.params.state,
                        });
                    }

                    const token = jwt.sign({
                        ...json
                    }, jwt_secret, {expiresIn: '1h'});
                    res.cookie('bearer', token, {
                        httpOnly: false
                    });
                    res.cookie('bearer-token', token, {
                        httpOnly: true
                    });
                }
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
                let allowed_apps = result.allowed_apps;

                const json_data = jwt.decode(getAppCookies(req, res)['bearer-token']);
                const id_token = jwt.sign({
                    user_id: makeid(10) + ':' + Buffer.from(result.user_id).toString('base64'),
                    time: Date.now(),
                    grant_types: json_data.grant_types
                }, jwt_secret, {expiresIn: '30s'});
                let index = allowed_apps.findIndex(m => m === json_data.app_id);
                if (index === -1) {
                    allowed_apps.push(json_data.app_id);
                }
                dbo.collection("users").updateOne({
                    username: username,
                    password: password
                }, {$set: {allowed_apps: allowed_apps}}, {upsert: false}, function (err, result_) {
                    if (err) console.log(err);
                    if (result_) {

                        const user_cookie = {
                            username: result.username,
                            email: result.email,
                            account_image: result.account_image,
                            password: result.password,
                            user_id: result.user_id,
                        };
                        res.cookie('default_account', JSON.stringify(user_cookie));
                        res.redirect(`${decodeURIComponent(json_data.callback)}?token=${id_token}&state=${json_data.state}`);
                    }
                });
            } else {
                res.json('Bad Request')
            }
        });
    });
});
router.post('/userinfo', (req, res) => {
    if (!req.body.client_public || !req.body.client_secret || !req.body.token) {
        res.status(400);
        res.json('Some Params Were Missing, Bad Request');
        //throw new Error('Some Params Were Missing');
    }
    var decoded = jwt.verify(req.body.token, jwt_secret);
    if (Math.floor((Date.now() - decoded.time) / 1000) > 30) {
        res.status(400);
        res.json('Token Expired');
        //throw new Error('Token Expired');
    } else {
        const
            user_id_decoded = Buffer.from(decoded.user_id.split(':')[1], 'base64').toString('ascii'),
            grant_types = decoded.grant_types.split(':');

        MongoClient.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
            if (err) {
                res.json('Cannot Connect to DB');
            }
            let dbo = db.db("auth");
            dbo.collection("users").findOne({
                user_id: user_id_decoded,
            }, function (err, result) {
                if (err) res.json(err);
                if (result) {
                    const user_result = {
                        username: result.username,
                        email: result.email,
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

module.exports = router;
