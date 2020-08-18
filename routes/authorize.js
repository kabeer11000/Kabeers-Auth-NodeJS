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
let jwt_secret = '42cChhRGag9Ux9z9l2phPRMk4Wvj5w';
let array_checker = (arr, target) => target.every(v => arr.includes(v));
let sessions_auth = [];
const ipInfo = require("ipinfo");
let mongoose = require('mongoose');
const fileGetContents = require('file-get-contents');

async function setDefaultUser(res, result) {
    if (result) {
        const user_cookie = {
            username: result.username,
            email: result.email,
            account_image: result.account_image,
            password: result.password,
            user_id: result.user_id,
            allowed_apps: JSON.stringify(result.allowed_apps)
        };
        res.cookie('default_account', JSON.stringify(user_cookie), {httpOnly: false});
    }
}

let getIp = (req) => {
    return req.headers['REMOTE_ADDR'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};

function getAppCookies(req, res) {
    /*
    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookies = {};
    rawCookies.forEach(rawCookie => {
        const parsedCookie = rawCookie.split('=');
        parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });
    return parsedCookies;*/
    return req.cookies
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
    });
});

router.get('/authorize/:app_id/:callback/:grant_types/:state/:prompt?', function (req, res, next) {
    if (!req.params.app_id || !req.params.callback || !req.params.grant_types || !req.params.state) {
        res.json('Some Params Were Missing, Bad Request');
        throw new Error('Some Params Were Missing');
    }
    if (!req.params.prompt) {
        req.params.prompt = 'show';
    }
    const
        app_id = decodeURIComponent(req.params.app_id),
        grant_types = decodeURIComponent(req.params.grant_types),
        callback = url.parse(decodeURIComponent(req.params.callback)),
        remote_app_id = '23rouHTvGJJ44sd8s2dZR6uaCn4sG',
        state = req.params.state,
        prompt = req.params.prompt;

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
                    scope: 'userinfo'
                };
                const gtypes_split = grant_types.split(':');
                if (!array_checker("email:username:account_image:user_id".split(':'), gtypes_split)) {
                    res.json('Invalid Claim Types');
                } else {
                    let grant_ui = [], html = ``;
                    try {
                        grant_types.split(':').map((v, i) => {
                            grant_ui.push(grant_types_index[v]);
                        });
                    } catch (e) {
                        console.log(e)
                    }
                    grant_ui.map((v) => {
                        html += `
                          <li class="mdc-list-item" tabindex="0">
                            <span class="mdc-list-item__ripple"></span>
                            <span class="mdc-list-item__text">
                              <span class="mdc-list-item__primary-text">${v.title}</span>
                              <span class="mdc-list-item__secondary-text">${v.description}</span>
                            </span>
                          </li>
                        `;
                    });

                    const default_account = getAppCookies(req, res)['default_account'] != null || undefined ? JSON.parse(decodeURIComponent(getAppCookies(req, res)['default_account'])) : "";
                    if (default_account) {
                        const cookie_allowed_apps = default_account.allowed_apps;
                        if (cookie_allowed_apps.includes(app_id)) {
                            if (prompt === 'none') {
                                res.render('auto_redirect.hbs', {
                                    username: default_account.username,
                                    password: default_account.password,
                                });
                            } else if (prompt === 'select_account') {
                                res.render('client_script', {script: `<script>window.location.href="http://localhost:3000/user/chooser"</script>`})
                            } else {
                                res.render('allow_acces_default_account.hbs', {
                                    username_: default_account.username,
                                    password_: default_account.password,
                                    profile_img: default_account.account_image,
                                    app_name: result.name,
                                    grant_types_ui: html,
                                    desc: `${result.name} has already been granted access to this account. ${result.name} has access to:`,
                                    btn: 'Continue',
                                    callback: result.callback_domain,
                                    code: authCode_id,
                                    state: req.params.state,
                                });
                            }
                        } else {
                            res.render('allow_acces_default_account.hbs', {
                                username_: default_account.username,
                                password_: default_account.password,
                                profile_img: default_account.account_image,
                                app_name: result.name,
                                grant_types_ui: html,
                                desc: `${result.name} wants access to this account. ${result.name} will receive:`,
                                btn: 'Allow',
                                callback: result.callback_domain,
                                code: authCode_id,
                                state: req.params.state,
                            });
                        }
                    } else {
                        res.render('allow_acces_password', {
                            app_name: result.name,
                            grant_types_ui: html,
                            desc: `${result.name} wants access to this account.`,
                            btn: 'Allow',
                            callback: result.callback_domain,
                            code: authCode_id,
                            state: req.params.state,
                        });
                    }

                    const token = jwt.sign({
                        ...json
                    }, jwt_secret, {expiresIn: '1m'});
                    res.cookie('bearer', token, {maxAge: new Date(60000), httpOnly: false});
                    res.cookie('bearer-token', token, {maxAge: new Date(60000), httpOnly: false})
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
                const user_id = result.user_id;
                //const userid = makeid(10) + ':' + Buffer.from(result.user_id).toString('base64');

                if (json_data !== "null") {
                    if (allowed_apps.findIndex(m => m === json_data.app_id) === -1) {
                        allowed_apps.push(json_data.app_id);
                    }
                }
                const authCode_id = makeid(13);
                const json = {
                    auth_code: authCode_id,
                    app_id: json_data.app_id,
                    user_id: result.user_id,
                    time: Date.now(),
                    expires: '2m',
                    callback: json_data.callback,
                    grant_types: json_data.grant_types,
                    used: false,
                };
                if (sessions_auth.findIndex(m => m.auth_code === json.auth_code) === -1) {
                    sessions_auth.push(json);
                }
                dbo.collection("users").updateOne({
                    username: username,
                    password: password
                }, {$set: {allowed_apps: allowed_apps}}, {upsert: false}, function (err, result_) {
                    if (err) console.log(err);
                    setDefaultUser(res, result).then(() => {
                        // `https://ipinfo.io/${getIp(req)||'39.50.171.187'}/geo`
                        fileGetContents(`https://ipinfo.io/${'39.50.171.187'}/geo`).then(cLoc => {
                            cLoc = JSON.parse(cLoc);
                            if (cLoc) {
                                const user_data_schema = {
                                    user_id: user_id,
                                    city: cLoc.city,
                                    region: cLoc.region,
                                    country: cLoc.country,
                                    location: {
                                        x: cLoc.loc.split(',')[0],
                                        y: cLoc.loc.split(',')[1],
                                    },
                                    postal: cLoc.postal,
                                    time_zone: cLoc.timezone,
                                    ip_address: cLoc.ip,
                                    time: Date.now(),
                                    date: new Date()
                                };
                                dbo.collection("user_data").insertOne(user_data_schema, {upsert: false}, function (err, result_) {
                                    if (err) console.log(err);
                                });
                            }
                        }).catch(err => {
                            console.error(err);
                        });
                        res.cookie('bearer-token', null, {maxAge: new Date(0), httpOnly: false});
                        res.cookie('bearer', null, {maxAge: new Date(0), httpOnly: false});
                        res.cookie('id-token', null, {maxAge: new Date(0), httpOnly: false});
                        res.json({
                            callback: `${decodeURIComponent(json.callback)}?code=${json.auth_code}&state=${json_data.state}`,
                            user_data: result,
                        });
                        //res.redirect(`${decodeURIComponent(json.callback)}?code=${json.auth_code}&state=${json_data.state}`);
                    });
                });
            } else {
                res.json('Bad Request')
            }
        });
    });
});
router.post('/token', (req, res) => {
    if (!req.body.client_secret ||
        !req.body.client_public ||
        !req.body.auth_code) {
        // sessions_auth.findIndex(m => m.auth_code === req.body.auth_code) === -1
        return res.json('Some Params Were Missing');
    }
    const session_value = sessions_auth[sessions_auth.findIndex(m => m.auth_code === req.body.auth_code)];
    if (Math.floor((Date.now() - session_value.time) / 1000) > 10 || session_value.used) {
        res.json('AuthCode Expired');
        //throw new Error('AuthCode Expired');
    } else {
        const
            app_public = req.body.client_public,
            app_secret = req.body.client_secret;

        if (req.body.auth_code === session_value.auth_code) {

            MongoClient.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
                if (err) {
                    res.json('Cannot Connect to DB');
                }
                let dbo = db.db("auth");

                dbo.collection("clients_app").findOne({
                    app_id: app_public,
                    app_secret: app_secret
                }, function (err, app) {
                    if (err) res.json(err);
                    if (app) {
                        let access_token = jwt.sign({
                            type: "access_token",
                            app_id: app_public,
                            app_secret: app_secret,
                            grant_types: session_value.grant_types,
                            time: Date.now(),
                            user_id: makeid(10) + ':' + Buffer.from(session_value.user_id).toString('base64'),
                            scope: 'userinfo',

                        }, jwt_secret);
                        let refresh_token = jwt.sign({
                            type: "refresh_token",
                            app_id: app_public,
                            app_secret: app_secret,
                            grant_types: session_value.grant_types,
                            time: Date.now(),
                            user_id: makeid(10) + ':' + Buffer.from(session_value.user_id).toString('base64'),
                            scope: 'userinfo',
                        }, jwt_secret);
                        sessions_auth.map((v, i) => {
                            if (v.auth_code === req.body.auth_code) {
                                //       sessions_auth.splice(i, i);
                                sessions_auth[i].used = true;
                            }
                        });
                        res.json({
                            access_token: access_token,
                            refresh_token: refresh_token,
                        })
                    }
                });
            });
        }
    }
});
router.get('/chooser', (req, res) => {
    /*
    res.render('account_chooser', {
        ...req.session.data_chooser,
    });
     */
    res.render('account_chooser');
});

router.post('/refresh', (req, res) => {
    if (!req.body.refresh_token) {
        res.status(400);
        res.json('Some Params Were Missing, Bad Request');
    }
    var decoded = jwt.verify(req.body.refresh_token, jwt_secret);
    if (Math.floor((Date.now() - decoded.time) / 1000 / 60 / 60) > 20 || decoded.type !== "refresh_token") {
        res.status(400);
        res.json('Token Expired');
    } else {
        let access_token = jwt.sign({
            type: "access_token",
            time: Date.now(),
            app_id: decoded.app_id,
            app_secret: decoded.app_secret,
            grant_types: decoded.grant_types,
            user_id: decoded.user_id,
            scope: decoded.scope,
        }, jwt_secret);
        res.json(access_token);
    }
});
router.post('/userinfo', (req, res) => {
    if (!req.body.client_public || !req.body.client_secret || !req.body.token) {
        res.status(400);
        res.json('Some Params Were Missing, Bad Request');
        //throw new Error('Some Params Were Missing');
    }
    var decoded = jwt.verify(req.body.token, jwt_secret);
    if (decoded && Math.floor((Date.now() - decoded.time) / 1000) > 30 || decoded.type !== "access_token") {
        res.status(400);
        res.json('Token Expired');
        //throw new Error('Token Expired');
    } else {
        if (decoded.scope !== 'userinfo') {
            res.status(400).json('Invalid Scope');
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
    }
});
router.get('/token_validation/:token', (req, res) => {
    if (!req.params.token) {
        return res.status(401).json({message: 'Missing Authorization Header'});
    }
    jwt.verify(req.params.token, jwt_secret, {}, (e, v) => {
        if (e) res.json(e);
        if (v) res.json({status: 'valid', ...v});
    });

});

module.exports = router;
