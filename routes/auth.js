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
Array.prototype.compare = function (testArr) {
    if (this.length != testArr.length) return false;
    for (var i = 0; i < testArr.length; i++) {
        if (this[i].compare) { //To test values in nested arrays
            if (!this[i].compare(testArr[i])) return false;
        } else if (this[i] !== testArr[i]) return false;
    }
    return true;
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
        res.cookie('default_account', JSON.stringify(user_cookie), {
            httpOnly: false
        });
    }
}

const operation = (list1, list2, isUnion = false) =>
    list1.filter(a => isUnion === list2.some(b => a === b));
const inBoth = (list1, list2) => operation(list1, list2, true);

let virtual_sessions = [],
    virtual_session_builder = [];

function uiLogic(default_account, req, res, json, html, app_id, result) {
    const response_mode = req.params.response_mode;
    let main_json = {
        response_mode: response_mode,
        response_type: json.response_type,
        client_public: result.app_id,
        client_secret: result.app_secret,
        app_name_pnone: result.name
    };
    if (default_account && Object.keys(default_account).length !== 0) {
        const cookie_allowed_apps = default_account.allowed_apps;
        if (req.params.prompt === 'chooser') {
            // Show Account Chooser
            return res.render("api_views/account_chooser", {
                code: json.auth_code,
                app_name: result.name,
                grants: html,
                noPrompt: !0,
                ...main_json
            });
        }
        if (req.params.prompt === 'password') {
            // Show Password Page
            res.render("api_views/allow_acces_password", {
                app_name: result.name,
                grant_types_ui: html,
                desc: `${result.name} Already has access to this account.`,
                btn: "Allow",
                callback: json.callback,
                code: json.auth_code,
                state: json.state,
                data: json,
                ...main_json
            });
        }
        if (cookie_allowed_apps.find(app => app.id === app_id)) {
            // Remove === and Check if json.grant_types are a subset of Object.keys
            if (req.params.prompt === 'none' && Object.keys(cookie_allowed_apps.find(app => app.id === app_id).perms).join('|') === json.grant_types) {
                // Auto Redirect
                return res.render("api_views/auto_redirect.hbs", {
                    username_: default_account.username,
                    password_: default_account.password,
                    code: json.auth_code,
                    ...main_json
                });
            }
            // Show Default Account Page
            return res.render("api_views/allow_acces_default_account.hbs", {
                username_: default_account.username,
                password_: default_account.password,
                profile_img: default_account.account_image,
                app_name: result.name,
                grant_types_ui: html,
                desc: `${result.name} wants access to this account. ${result.name} will receive:`,
                btn: "Allow",
                callback: json.callback,
                code: json.auth_code,
                state: json.state,
                data: json,
                ...main_json
            });
        } else {
            // Show Default Account Page
            return res.render("api_views/allow_acces_default_account.hbs", {
                username_: default_account.username,
                password_: default_account.password,
                profile_img: default_account.account_image,
                app_name: result.name,
                grant_types_ui: html,
                desc: `${result.name} wants access to this account. ${result.name} will receive:`,
                btn: "Allow",
                callback: json.callback,
                code: json.auth_code,
                state: json.state,
                data: json,
                ...main_json
            });
        }
    } else {
        // Show Password Page
        return res.render("api_views/allow_acces_password", {
            app_name: result.name,
            grant_types_ui: html,
            desc: `${result.name} wants your to your account.`,
            btn: "Allow",
            callback: json.callback,
            code: json.auth_code,
            state: json.state,
            data: json,
            verified: result.verified,
            ...main_json
        });
    }
}

router.get('/authorize', async function (req, res, next) {
    req.params = req.query;
    if (!req.params.client_id || !req.params.scope || !req.params.response_type || !req.params.redirect_uri) {
        return res.status(400).json('Some Params Were Missing, Bad Request');
    }
    const
        app_id = decodeURIComponent(req.params.client_id),
        grant_type = decodeURIComponent(req.params.scope),
        callback_domain = decodeURIComponent(req.params.redirect_uri);

    MongoClient.connect(mongo_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(function (db, err) {
        if (err) return res.status(500).json('Cannot Connect to DB');
        let dbo = db.db("auth");
        dbo.collection("clients_app").findOne({
            app_id: app_id
        }).then(function (result, err) {
            if (err) return res.status(500).json(err);
            if (result && ['token', 'code'].includes(req.params.response_type) && result.callback_domain.includes(callback_domain)) {
                const
                    authCode_id = makeid(13),
                    json = {
                        auth_code: authCode_id,
                        app_id: result.app_id,
                        grant_types: grant_type,
                        time: Date.now(),
                        expires: '2m',
                        callback: callback_domain,
                        state: req.params.state,
                        nonce: req.params.nonce,
                        used: false,
                        response_type: req.params.response_type
                    };
                let api_ids = [];
                let grant_ui = [],
                    html = ``;
                try {
                    grant_type.split('|').map((v, i) => {
                        grant_ui.push(grant_type.split('|')[i].split(':')[1]);
                        api_ids.push(grant_type.split('|')[i].split(':')[0]);
                    });
                } catch (e) {
                    console.log(e)
                }
                api_ids = api_ids.filter(function (item, pos) {
                    return api_ids.indexOf(item) === pos;
                });
                dbo.collection("clients_api").find({
                    client_public: {
                        $in: api_ids.filter(function (i, n) {
                            return api_ids.indexOf(i) === n
                        })
                    }
                })
                    .toArray()
                    .then(async (api_result, err) => {
                        if (err) return res.status(500).json(err);
                        if (api_result) {
                            let a = [];
                            // Create Description
                            for (let i = 0; i < grant_type.split('|').length; i++) {
                                let result = api_result.find((value => value.client_public === grant_type.split('|')[i].split(':')[0]));
                                a.push({
                                    title: result.name,
                                    image: result.app_image,
                                    desc: result.grant_desc[grant_type.split('|')[i]]
                                });
                            }
                            grant_ui.map((v, i) => {
                                html += `<div class="card permission_container" style="box-shadow:none"> <div class="card-header text-left" data-toggle="collapse" data-target="#${i}" aria-expanded="true" aria-controls="collapseOne" id="headingOne"> <h5 class="mb-0"> <div class="btn k_btn btn-link text-truncate w-100"><img src="${a[i].image}" style="width: 2rem;height: auto;margin-right: 1rem" onerror="this.onerror=null;this.src='https://www.materialui.co/materialIcons/image/broken_image_black_192x192.png'"> <span class="text-muted small">${a[i].title}:</span> ${v.replace(/[^a-zA-Z0-9]/g, " ")}</div> </h5> </div> <div id="${i}" class="collapse" aria-labelledby="headingOne" data-parent="#accordion"> <div class="card-body"> ${a[i].desc} </div> </div> </div><style>.k_btn, .permission_container{text-align: left!important}</style>`;
                            });
                            // Start Virtual Session
                            if (virtual_session_builder.findIndex(m => m.auth_code === json.auth_code) === -1) {
                                virtual_session_builder.push(json);
                            }
                            if (req.params.response_type === 'token') {
                                if (!req.params.client_secret || req.params.client_secret !== result.app_secret) {
                                    return res.status(400).json('Bad Request');
                                }
                            }
                            const default_account = getAppCookies(req, res)['default_account'] != null || undefined ? JSON.parse(decodeURIComponent(getAppCookies(req, res)['default_account'])) : "";
                            return uiLogic(default_account, req, res, json, html, app_id, result);
                        }
                    });

            } else {
                return res.status(400).json('Bad Request');
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

    MongoClient.connect(mongo_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(async function (db, err) {
        if (err) return res.status(500).json('Cannot Connect to DB');
        let dbo = db.db("auth");
        dbo.collection("users").findOne({
            username: username,
            password: password
        }).then(async function (result, err) {
            if (err) return res.status(500).json(err);
            if (result) {
                let allowed_apps = result.allowed_apps;
                const
                    perms = {},
                    json = virtual_session_builder.find((authObject) => authObject.auth_code === authCode);

                if (json) {
                    json.grant_types.split('|').map((v, i) => perms[v] = true);
                    const currentApp = {
                        id: `${json.app_id}`,
                        perms: {
                            ...perms
                        }
                    };
                    const allowedAppIndex = allowed_apps.findIndex(m => m.id === json.app_id);
                    allowedAppIndex === -1 ? (allowed_apps.push(currentApp)) : (allowed_apps[allowedAppIndex] = currentApp);
                }
                dbo.collection("users").updateOne({
                    username: username,
                    password: password
                }, {
                    $set: {
                        allowed_apps: [...allowed_apps]
                    }
                }, {
                    upsert: false
                })
                    .then(async () => {
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

                        const
                            urlified_state = inner_json.state ? `&state=${inner_json.state}` : "",
                            urlified_nonce = inner_json.state ? `&nonce=${inner_json.nonce}` : "";

                        setDefaultUser(res, result);
                        return res.json({
                            callback: `${decodeURIComponent(inner_json.callback)}?code=${inner_json.auth_code}${urlified_state}${urlified_nonce}`,
                            user_data: result,
                        });
                    }).catch(e => {
                    console.error(e)
                })
            } else {
                return res.status(400).json('Bad Request');
            }
        });
    });
});

router.post('/token', async function (req, res) {
    if (!req.body.client_secret ||
        !req.body.client_public ||
        !req.body.auth_code) {
        return res.status(400).json('Some Params Were Missing, Auth Code Does Not Exist OR is Used');
    }
    let authObject = virtual_sessions.find((authObject) => authObject.auth_code === req.body.auth_code);
    if (!authObject || Math.floor((Date.now() - authObject.time) / 1000) > 1020 || !authObject || authObject.used) {

        // End Virtual Session So They Dont Hog Memory
        let authObjectIndex = virtual_sessions.findIndex((_authObject) => _authObject.auth_code === authObject.auth_code);
        virtual_sessions.splice(authObjectIndex, authObjectIndex);

        return res.status(400).json('AuthCode Expired');
    }
    const
        app_public = req.body.client_public,
        app_secret = req.body.client_secret,
        grants = authObject.grant_types.split('|');

    let app_ids_from_grants = [],
        grants_from_grants = [];
    grants.map((value, index) => {
        app_ids_from_grants.push(value.split(':')[0]);
        grants_from_grants.push(value.split(':')[0] + ':' + value.split(':')[1]);
    });
    app_ids_from_grants = app_ids_from_grants.filter(function (item, pos) {
        return app_ids_from_grants.indexOf(item) === pos;
    });

    MongoClient.connect(mongo_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(async function (db, err) {
        if (err) {
            return res.status(500).json('Cannot Connect to DB');
        }
        let dbo = db.db("auth");
        dbo.collection("clients_app").findOne({
            app_id: app_public,
            app_secret: app_secret
        }).then(async function (app, err) {
            if (err) return res.json(err);
            if (app) {
                dbo.collection("clients_api").find({
                    client_public: {
                        $in: app_ids_from_grants
                    }
                })
                    .toArray(async function (e, clients_api) {
                        if (err) return console.log(err);
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
                                        }, v.client_secret, {
                                            expiresIn: v.token_length || '2h' // 2 hours
                                        }),
                                        refresh_token: jwt.sign({
                                            type: "refresh_token",
                                            app_name: app.name,
                                            app_id: v.client_public,
                                            sign: encrypt(v.client_secret),
                                            grant_types: inBoth(grants, v.grant_types.split('|')).join('|'),
                                            user_id: authObject.user_id,
                                        }, v.client_secret, {
                                            expiresIn: '10d'
                                        })
                                    }
                                });
                            });
                            // End Virtual Session
                            let authObjectIndex = virtual_sessions.findIndex((_authObject) => _authObject.auth_code === authObject.auth_code);
                            virtual_sessions.splice(authObjectIndex, authObjectIndex);
                            authObjectIndex = undefined;

                            return res.json(tokens);
                        }
                        return res.json('App(s) Not Found, Bad Request');
                    });
            } else {
                return res.json('Invalid Token, Bad Request');
            }
        });
    });
});

router.post('/refresh', (req, res) => {
    if (!req.body.refresh_token || !req.body.client_public || !req.body.client_secret) {
        return res.status(400).json('Some Params Were Missing, Bad Request');
    }
    let decoded = jwt.decode(req.body.refresh_token),
        decrypted_sign = decrypt(decoded.sign),
        verified = jwt.verify(req.body.refresh_token, decrypted_sign);

    if (Math.floor((Date.now() - decoded.time) / 1000 / 60 / 60) > 10 || decoded.type !== "refresh_token" || !verified || verified.app_id === req.body.client_public) {
        return res.status(400).json('Token Expired Or Not Refresh Token Or Un Verified');
    }
    MongoClient.connect(mongo_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function (err, db) {
        if (err) {
            return res.status(500).json('Cannot Connect to DB');
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
            }, decrypted_sign, {
                expiresIn: '2h'
            });
            return res.json(access_token);
        });
    });
});

module.exports = router;
