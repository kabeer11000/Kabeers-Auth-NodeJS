const express = require('express'),
    router = express.Router(),
    mongo = require('mongodb'),
    MongoClient = mongo.MongoClient,
    url = require('url'),
    jwt = require('jsonwebtoken'),
    mongo_uri = require('.././keys/mongo_key'),
    ed_ = require('./encrypt_decrypt'),
    encrypt = ed_.encrypt,
    decrypt = ed_.decrypt,
    bcrypt = require('bcrypt'),
    nodemailer = require('nodemailer');
Array.prototype.compare = function (testArr) {
    if (this.length !== testArr.length) return false;
    for (var i = 0; i < testArr.length; i++) {
        if (this[i].compare) { //To test values in nested arrays
            if (!this[i].compare(testArr[i])) return false;
        } else if (this[i] !== testArr[i]) return false;
    }
    return true;
};

const makeid = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const mongoClient = MongoClient.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(db => db.db("auth"));

const getAppCookies = (req) => req.cookies;

const setDefaultUser = (res, result) => res.cookie('default_account', JSON.stringify(result), {
    httpOnly: false
});

const operation = (list1, list2, isUnion = false) =>
    list1.filter(a => isUnion === list2.some(b => a === b));
const inBoth = (list1, list2) => operation(list1, list2, true);
const sendMail = ({email, title, body}) => new Promise(((resolve, reject) => nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kabeersnetwork@gmail.com',
            pass: 'ALIBADSHAH2021'
        },
        // host: "in-v3.mailjet.com",
        // port: 589,
        // secure: false,
        // auth: {
        //     user: '7289142e43fb4dd83da81996b455ddeb',
        //     pass: '12a0953938273483e54f3cc6e8f9d1da'
        // }
    }).sendMail({
        from: 'kabeersnetwork@gmail.com',
        to: `${email}`,
        subject: `${title}`,
        text: `${body}`
    }, (error, info) => error ? reject(error) : resolve(info))
));
const virtual_sessions = [],
    virtual_session_builder = [];

const uiLogic = (default_account, req, res, json, app_id, result, perms) => {
    //const response_mode = req.params.response_mode;
    const file_name = 'api_views/react';
    const main_json = {
        appName: result.name,
        clientPublic: json.app_id,
        appIcon: result.icon || 'https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_my_library_music_48px-512.png',
        authCode: json.auth_code,
        appPerms: Buffer.from(JSON.stringify(perms)).toString('base64'),
    };
    if (default_account && Object.keys(default_account).length !== 0) {
        const cookie_allowed_apps = default_account.allowed_apps;
        if (req.params.prompt === 'chooser') return res.render(file_name, {
            promptType: 'chooser',
            ...main_json
        }); // Show Account Chooser

        if (req.params.prompt === 'password') return res.render(file_name, {
            promptType: 'password',
            ...main_json
        }); // Show Password Page

        if (cookie_allowed_apps.find(app => app.id === app_id)) {
            // Remove === and Check if json.grant_types are a subset of Object.keys
            if (req.params.prompt === 'none' && Object.keys(cookie_allowed_apps.find(app => app.id === app_id).perms).join('|') === json.grant_types) return res.render(file_name, {
                promptType: 'none',
                account: Buffer.from(JSON.stringify(default_account)).toString('base64'),
                ...main_json
            }); // Auto Redirect

            return res.render(file_name, {
                promptType: 'consent',
                ...main_json
            }); // Show Default Account Page

        } else return res.render(file_name, {
            promptType: 'consent',
            ...main_json
        }); // Show Default Account Page

    }
    return res.render(file_name, {
        promptType: 'password',
        ...main_json
    }); // Show Password Page
};

router.post('/implict_grant_unhash_secret', (req, res) => {
    if (!req.body.hash || !req.body.auth_code) return res.status(400).json('No Hash or code Found');
    const
        authCode = req.body.auth_code,
        secretKeyHash = req.body.secret_key_hash;

    const json = virtual_session_builder.find((authObject) => authObject.auth_code === authCode);
    if (json['secret_key_hash'] === secretKeyHash) return res.json(json.secret_key);
    else return res.status(400).json('App Not Allowed Implicit Grant');
});
//TODO UPDATE
router.post(['/user/challenge/chooser_login_verification'], (req, res) => {
    if (!req.body.username || !req.body.password || !req.body.deviceId) res.status(400).json('Some Params Were Missing Or AuthCode was invalid, Bad Request');

    const
        username = req.body.username,
        password = req.body.password,
        deviceId = req.body.deviceId;

    mongoClient.then((db) => db.collection("users").findOne({
        $or: [
            {
                username: username,
                password: password
            },
            {
                email: username,
                password: password
            }
        ],
    }).then((result) => {
        if (!result) return res.status(400).json('Nothing Found');
        if (result.two_factor_auth && !result.webauthn_devices.includes(deviceId)) return res.json({
            status: 69,
            message: "device verification failed",
        }); // Two Factor Auth
        return (setDefaultUser(res, result), res.json({
            ...result,
            status: 200,
            message: "Verified",
        }));
    }).catch(e => res.status(500).json("Database Error")))
});
router.post('/user/devices/update', (req, res) => {
    if (!req.body.username || !req.body.password || !req.body.deviceId || !req.body.code) res.status(400).json('Some Params Were Missing Or AuthCode was invalid, Bad Request');
    const
        username = req.body.username,
        password = req.body.password,
        deviceId = req.body.deviceId,
        code = req.body.code;

    mongoClient.then((db) => db.collection("users").findOneAndUpdate({
        $or: [
            {
                username: username,
                password: password,
                deviceVerificationCode: parseInt(code)
            },
            {
                email: username,
                password: password,
                deviceVerificationCode: parseInt(code)
            }
        ],
    }, {
        $unset: {
            deviceVerificationCode: ""
        },
        $addToSet: {webauthn_devices: deviceId}
    }).then((result) => {
        if (!result.value) return res.status(400).json('Nothing Found');
        return (setDefaultUser(res, result.value), res.json({
            ...result.value,
            message: "Devices Updated",
            status: 200
        }));
    }).catch(e => res.status(500).json(e)))
});
router.post("/user/devices/verify/email", (req, res) => {
    if (!req.body.username || !req.body.password) res.status(400).json('Some Params Were Missing Or AuthCode was invalid, Bad Request');

    const
        username = req.body.username,
        password = req.body.password,
        code = Math.floor(100000 + Math.random() * 900000);

    mongoClient.then((db) => db.collection("users").findOneAndUpdate({
        $or: [
            {
                username: username,
                password: password
            },
            {
                email: username,
                password: password
            }
        ],
    }, {
        $set: {
            deviceVerificationCode: code
        }
    }).then((result) => {
        if (!result) return res.status(400).json("User Not Found Bad Request");
//        console.log(code);
//        res.json("done")
        sendMail({
            email: result.value.email,
            title: `Device Verification`,
            body: `We have detected a login attempt from a device you don't use. Here is your verification code <br/> <h3><code>${code}</code></h3> <br/> IP: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`,
        }).then(() => res.json({
            message: "email Sent",
            status: 200
        })).catch(e => res.status(500).json(e));
    })
        .catch(e => res.status(500).json(e)))
        .catch(e => res.status(500).json(e));
});
router.post('/user/create-account', (req, res) => {
    if (!req.body.email || !req.body.username || !req.body.password) res.json('Some Params Were Missing Or AuthCode was invalid, Bad Request');

    const
        username = req.body.username,
        password = req.body.password,
        email = req.body.email,
        accountImage = req.body.accountImage,
        name = `${req.body.firstname} ${req.body.lastname}`;

    MongoClient.connect(mongo_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(async function (db, err) {
        if (err) return res.status(500).json('Cannot Connect to DB');
        let dbo = db.db("auth");
        const token = makeid(20);
        dbo.collection("users").find({
            username: username,
            email: email
        }).toArray().then((result) => {
            if (result.length) return res.status(400).json('User name or Email already Exists');
            dbo.collection("users").insertOne({
                username: username,
                email: email,
                password: password,
                name: name,
                account_image: accountImage || 'https://ssl.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png',
                time: Date.now(),
                date: new Date(),
                verified: false,
                token: token
            }).then(() => {
                setDefaultUser(res, result);
                res.json({token: token});
            }).catch(e => res.status(400).json(e));
        }).catch(e => res.status(500).json(e))
    }).catch(e => res.status(500).json(e))
});
router.post("/user/session/state/:method", (req, res) => {
    console.log(req.body);
    if (req.params.method === "get") return req.session.app_auth_state ? res.json(req.session.app_auth_state) : res.status(400).json("Nothing Defined");
    else if (req.params.method === "save" && req.body.id) {
        req.session.app_auth_state = JSON.parse(req.body.state);
        return res.send(req.session.app_auth_state);
    } else return res.status(400).json("Nothing Was Defined");
});
router.get('/user/verify/:token', (req, res) => {
    if (!req.params.token) return res.status(400).json('Cannot Verify Token');
    mongoClient.then(async function (db) {
        db.collection("users").findOne({
            token: req.params.token,
            verified: false
        }).then(result => result ? db.collection("users").updateOne({
            token: req.params.token,
            verified: false
        }, {$set: {verified: true}}).then(result => res.back()) : res.status(400).json('Already Verified'))
            .catch(e => res.status(500).json(e))
    }).catch(e => res.status(500).json(e));
});
router.get('/authorize', async function (req, res, next) {
    req.params = req.query;
    if (!req.params.client_id || !req.params.scope || !req.params.response_type || !req.params.redirect_uri) return res.status(400).json('Some Params Were Missing, Bad Request');

    const
        app_id = decodeURIComponent(req.params.client_id),
        grant_type = decodeURIComponent(req.params.scope),
        callback_domain = decodeURIComponent(req.params.redirect_uri);

    mongoClient.then(dbo => dbo.collection("clients_app").findOne({
        app_id: app_id
    }).then(result => {
        if (!result || !['token', 'code'].includes(req.params.response_type) || !result.callback_domain.includes(callback_domain)) return res.status(400).json("Response Type or Callback Domain Not Supported, Or App Not Found");
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
        dbo.collection("clients_api").find({
            client_public: {
                $in: grant_type.split('|').map((v, i) => (grant_type.split('|')[i].split(':')[0])).filter((i, n, a) => a.indexOf(i) === n)
            }
        })
            .toArray()
            .then(async (api_result) => {
                if (!api_result) return new Error('App Not Found');
                // Start Virtual Session
                if (!virtual_session_builder.find(m => m.auth_code === json.auth_code)) virtual_session_builder.push(json);
                if (req.params.response_type === 'token') if (!req.params.client_secret || req.params.client_secret !== result.app_secret) return res.status(400).json('Bad Request');
                return uiLogic(getAppCookies(req, res)['default_account'] != null || undefined ? JSON.parse(decodeURIComponent(getAppCookies(req, res)['default_account'])) : null, req, res, json, app_id, result, grant_type.split('|').map(grant => {
                    const result = api_result.find((value => value.client_public === grant.split(':')[0]));
                    return ({
                        title: result.name,
                        image: result.app_image,
                        desc: result.grant_desc[grant]
                    });
                }));
            });
    }).catch(err => res.status(500).json(err)))
        .catch(err => res.status(500).json("Database Error"));
});
router.post('/allow', (req, res) => {
    const vs = virtual_session_builder.find(value => value.auth_code === req.body.auth_code);
    if (!req.body.username || !req.body.password || !req.body.auth_code || !vs) return res.json('Some Params Were Missing Or AuthCode was invalid, Bad Request');
    const
        username = req.body.username,
        password = req.body.password,
        authCode = req.body.auth_code;

    mongoClient.then(async dbo => dbo.collection("users").findOne({
        username: username,
        password: password
    }).then(async result => {
        if (!result) return new Error("User Not Found");
        const allowed_apps = result.allowed_apps;
        const perms = {};
        vs.grant_types.split('|').map((v, i) => perms[v] = true);
        const currentApp = {
            id: `${vs.app_id}`,
            perms: {
                ...perms
            }
        };
        const allowedAppIndex = allowed_apps.findIndex(m => m.id === vs.app_id);
        !allowedAppIndex ? (allowed_apps.push(currentApp)) : (allowed_apps[allowedAppIndex] = currentApp);

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
            .then(() => {
                virtual_sessions.find((s) => s.auth_code === vs.auth_code) || virtual_sessions.push({
                    ...vs,
                    user_id: result.user_id
                });
                const s = virtual_session_builder.findIndex((s) => s.auth_code === vs.auth_code);
                return virtual_session_builder.splice(s, s), setDefaultUser(res, result), res.json({callback: `${decodeURIComponent(vs.callback)}?code=${vs.auth_code}${vs.state ? `&state=${vs.state}` : ""}${vs.state ? `&nonce=${vs.nonce}` : ""}`});
            }).catch((s) => res.status(500).json(s));
    }).catch((err) => res.status(500).json(err)))
        .catch((err) => res.status(500).json('Cannot Connect to DB'));
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
                                if (req.query.modern === 'true') {
                                    return tokens.push({
                                        app_id: v.client_public,
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
                                    });
                                }
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
                            const authObjectIndex = virtual_sessions.findIndex((_authObject) => _authObject.auth_code === authObject.auth_code);
                            virtual_sessions.splice(authObjectIndex, authObjectIndex);

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
