const express = require('express'),
    router = express.Router(),
    mongo = require('mongodb'),
    MongoClient = mongo.MongoClient,
    url = require('url'),
    jwt = require('jsonwebtoken'),
    mongo_uri = require('.././keys/mongo_key'),
    ed_ = require('./encrypt_decrypt'),
    encrypt = ed_.encrypt,
    decrypt = ed_.decrypt;

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getAppCookies(req) {
    return req.cookies;
}

function setDefaultUser(res, result) {
    if (result) {
        const user_cookie = {
            username: result.username,
            email: result.email,
            account_image: result.account_image,
            password: result.password,
            user_id: result.user_id,
            allowed_apps: result.allowed_apps
        };
        res.cookie('default_account', JSON.stringify(user_cookie), {httpOnly: false});
    }
}

const operation = (list1, list2, isUnion = false) =>
    list1.filter(a => isUnion === list2.some(b => a === b));
const inBoth = (list1, list2) => operation(list1, list2, true);

let virtual_sessions = [], virtual_session_builder = [];

router.get('/:app_id/:grant_types/:res_type/:callback/:state?/:prompt?', function (req, res, next) {
    if (!req.params.app_id || !req.params.grant_types) {
        return res.json('Some Params Were Missing, Bad Request');
    }
    const
        app_id = decodeURIComponent(req.params.app_id),
        grant_type = decodeURIComponent(req.params.grant_types);

    MongoClient.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) {
            res.json('Cannot Connect to DB');
        }
        let dbo = db.db("auth");
        dbo.collection("clients_app").findOne({app_id: app_id}, function (err, result) {
            if (err) return res.json(err);
            if (result && req.params.res_type === 'code') {
                const authCode_id = makeid(13);
                const json = {
                    auth_code: authCode_id,
                    app_id: result.app_id,
                    grant_types: grant_type,
                    time: Date.now(),
                    expires: '2m',
                    callback: result.callback_domain,
                    state: req.params.state,
                    used: false,
                };
                let grant_ui = [], html = ``;
                try {
                    grant_type.split('|').map((v, i) => {
                        grant_ui.push(grant_type.split('|')[i].split(':')[1]);
                    });
                } catch (e) {
                    console.log(e)
                }
                grant_ui.map((v) => {
                    html += `
                          <li class="mdc-list-item" tabindex="0">
                            <span class="mdc-list-item__ripple"></span>
                            <span class="mdc-list-item__text">
                              <span class="mdc-list-item__primary-text">${v}</span>
                            </span>
                          </li>
                        `;
                });
                // Start Virtual Session
                if (virtual_session_builder.findIndex(m => m.auth_code === json.auth_code) === -1) {
                    virtual_session_builder.push(json);
                }
                const default_account = getAppCookies(req, res)['default_account'] != null || undefined ? JSON.parse(decodeURIComponent(getAppCookies(req, res)['default_account'])) : "";
                if (default_account && Object.keys(default_account).length !== 0) {
                    const cookie_allowed_apps = default_account.allowed_apps;
                    if (cookie_allowed_apps.includes(app_id)) {
                        if (req.params.prompt === 'none') return res.render('api_views/auto_redirect.hbs', {
                            username_: default_account.username,
                            password_: default_account.password,
                            code: json.auth_code
                        });
                        if (req.params.prompt === 'chooser') return res.render('api_views/account_chooser', {code: json.auth_code});
                        if (req.params.prompt === 'password') return res.render('api_views/allow_acces_password', {
                            app_name: result.name,
                            grant_types_ui: html,
                            desc: `${result.name} Already has access to this account.`,
                            btn: 'Allow',
                            callback: json.callback,
                            code: json.auth_code,
                            state: json.state,
                            data: json,
                        });
                        res.render('api_views/allow_acces_default_account.hbs', {
                            username_: default_account.username,
                            password_: default_account.password,
                            profile_img: default_account.account_image,
                            app_name: result.name,
                            grant_types_ui: html,
                            desc: `${result.name} wants access to this account. ${result.name} will receive:`,
                            btn: 'Allow',
                            callback: json.callback,
                            code: json.auth_code,
                            state: json.state,
                            data: json,
                        });
                    }
                } else {
                    res.render('api_views/allow_acces_password', {
                        app_name: result.name,
                        grant_types_ui: html,
                        desc: `${result.name} wants access to this account.`,
                        btn: 'Allow',
                        callback: json.callback,
                        code: json.auth_code,
                        state: json.state,
                        data: json,
                    });
                }
            } else {
                res.json('Bad Request')
            }
        });
    });
});
router.post('/allow', function (req, res) {
    if (!req.body.username || !req.body.password || !virtual_sessions.map((value => value.auth_code === req.body.code))) {
        res.json('Some Params Were Missing Or AuthCode was invalid, Bad Request');
    }
    const
        username = req.body.username,
        password = req.body.password,
        authCode = req.body.auth_code;

    MongoClient.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) {
            res.json('Cannot Connect to DB');
        }
        let dbo = db.db("auth");
        dbo.collection("users").findOne({username: username, password: password}, function (err, result) {
            if (err) res.json(err);
            if (result) {
                let allowed_apps = result.allowed_apps;
                const json = virtual_session_builder.find((authObject) => authObject.auth_code === authCode);
                if (json) {
                    if (allowed_apps.findIndex(m => m === json.app_id) === -1) {
                        allowed_apps.push(json.app_id);
                    }
                }
                dbo.collection("users").updateOne({
                    username: username,
                    password: password
                }, {$set: {allowed_apps: allowed_apps}}, {upsert: false})
                    .then(() => {
                        if (err) console.log(err);

                        const inner_json = {
                            ...json,
                            user_id: result.user_id,
                        };

                        // Start Virtual Session
                        if (virtual_sessions.findIndex(m => m.auth_code === json.auth_code) === -1) {
                            virtual_sessions.push(inner_json);
                        }
                        // End Virtual Session Builder So They Dont Hog Memory
                        let authObjectIndex = virtual_session_builder.findIndex((_authObject) => _authObject.auth_code === inner_json.auth_code);
                        virtual_session_builder.splice(authObjectIndex, authObjectIndex);
                        setDefaultUser(res, result);
                        return res.json({
                            callback: `${decodeURIComponent(inner_json.callback)}?code=${inner_json.auth_code}&state=${inner_json.state}`,
                            user_data: result,
                        });
                    }).catch(e => {
                    console.error(e)
                })

            } else {
                res.json('Bad Request');
            }
        });
    });
});

router.post('/token', function (req, res) {
    if (!req.body.client_secret ||
        !req.body.client_public ||
        !req.body.auth_code) {
        return res.status(400).json('Some Params Were Missing, Auth Code Does Not Exist OR is Used');
    }
    let authObject = virtual_sessions.find((authObject) => authObject.auth_code === req.body.auth_code);
    if (!authObject || Math.floor((Date.now() - authObject.time) / 1000) > 1020 || !authObject || authObject.used) {
        res.status(400).json('AuthCode Expired');

        // End Virtual Session So They Dont Hog Memory
        let authObjectIndex = virtual_sessions.findIndex((_authObject) => _authObject.auth_code === authObject.auth_code);
        virtual_sessions.splice(authObjectIndex, authObjectIndex);

    } else {
        const
            app_public = req.body.client_public,
            app_secret = req.body.client_secret,
            grants = authObject.grant_types.split('|');

        let app_ids_from_grants = [];
        let grants_from_grants = [];
        grants.map((value, index) => {
            app_ids_from_grants.push(value.split(':')[0]);
            grants_from_grants.push(value.split(':')[0] + ':' + value.split(':')[1]);
        });
        app_ids_from_grants = app_ids_from_grants.filter(function (item, pos) {
            return app_ids_from_grants.indexOf(item) === pos;
        });

        MongoClient.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
            if (err) {
                res.json('Cannot Connect to DB');
            }
            let dbo = db.db("auth");
            dbo.collection("clients_app").findOne({app_id: app_public, app_secret: app_secret}, function (err, app) {
                if (err) res.json(err);
                if (app) {
                    dbo.collection("clients_api").find({client_public: {$in: app_ids_from_grants}})
                        .toArray(function (e, clients_api) {
                            if (err) console.log(err);
                            if (clients_api) {
                                let tokens = [];
                                clients_api.map((v, i) => {
                                    tokens.push({
                                        [v.client_public]: {
                                            access_token: jwt.sign({
                                                type: "access_token",
                                                app_name: app.name,
                                                app_id: v.client_public,
                                                grant_types: inBoth(grants, v.grant_types.split('|')).join('|'),
                                                user_id: authObject.user_id,
                                            }, v.client_secret, {expiresIn: '1h'}),
                                            refresh_token: jwt.sign({
                                                type: "refresh_token",
                                                app_name: app.name,
                                                app_id: v.client_public,
                                                sign: encrypt(v.client_secret),
                                                grant_types: inBoth(grants, v.grant_types.split('|')).join('|'),
                                                user_id: authObject.user_id,
                                            }, v.client_secret, {expiresIn: '10d'})
                                        }
                                    });
                                });
                                res.json(tokens);

                                // End Virtual Session
                                let authObjectIndex = virtual_sessions.findIndex((_authObject) => _authObject.auth_code === authObject.auth_code);
                                virtual_sessions.splice(authObjectIndex, authObjectIndex);
                            } else {
                                res.json('App(s) Not Found, Bad Request');
                            }
                        });
                } else {
                    res.json('Invalid Token, Bad Request');
                }
            });
        });
    }
});

router.post('/refresh', (req, res) => {
    if (!req.body.refresh_token || !req.body.client_public || !req.body.client_secret) {
        return res.status(400).json('Some Params Were Missing, Bad Request');
    }
    var decoded = jwt.decode(req.body.refresh_token);
    var decrypted_sign = decrypt(decoded.sign);
    var verified = jwt.verify(req.body.refresh_token, decrypted_sign);
    if (Math.floor((Date.now() - decoded.time) / 1000 / 60 / 60) > 10 || decoded.type !== "refresh_token" || !verified || verified.app_id === req.body.client_public) {
        return res.status(400).json('Token Expired Or Not Refresh Token Or Un Verified');
    }
    MongoClient.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) {
            return res.json('Cannot Connect to DB');
        }
        let dbo = db.db("auth");
        dbo.collection("clients_app").findOne({
            app_id: req.body.client_public,
            app_secret: req.body.client_secret
        }, function (err, app) {
            let access_token = jwt.sign({
                type: "access_token",
                app_name: app.name,
                app_id: verified.app_id,
                grant_types: verified.grant_types,
                user_id: verified.user_id
            }, decrypted_sign, {expiresIn: '1h'});
            return res.json(access_token);
        });
    });
});
module.exports = router;
