const express = require('express'),
    router = express.Router(),
    mongo = require('mongodb'),
    MongoClient = mongo.MongoClient,
    url = require('url'),
    jwt = require('jsonwebtoken'),
    mongo_uri = require('../../../.././keys/mongo_key'),
    ed_ = require('../../.././encrypt_decrypt'),
    encrypt = ed_.encrypt,
    decrypt = ed_.decrypt;

const getAppCookies = (req) => req.cookies;
const samplePerms = [
    {
        "id": "as4cb94164a10fa702c09aa0f3e2fd3f8e77a73e",
        "perms": {
            "p6rouHTvGJJCn9OuUNTZRfuaCnwc6:files": true,
            "p6rouHTvGJJCn9OuUNTZRfuaCnwc6:folder": true,
            "p6rouHTvGJJCn9OuUNTZRfuaCnwc6:email": true,
            "p6rouHTvGJJCn9OuUNTZRfuaCnwc6:username": true,
            "p6rouHTvGJJCn9OuUNTZRfuaCnwc6:upload": true,
            "AStroWorld_Cn9OuUNTZRfuaCnwc6:email": true,
            "AStroWorld_Cn9OuUNTZRfuaCnwc6:username": true,
            "AStroWorld_Cn9OuUNTZRfuaCnwc6:account_image": true,
            "AStroWorld_Cn9OuUNTZRfuaCnwc6:city": true,
            "AStroWorld_Cn9OuUNTZRfuaCnwc6:region": true,
            "AStroWorld_Cn9OuUNTZRfuaCnwc6:country": true,
            "AStroWorld_Cn9OuUNTZRfuaCnwc6:location": true,
            "AStroWorld_Cn9OuUNTZRfuaCnwc6:postal": true,
            "AStroWorld_Cn9OuUNTZRfuaCnwc6:time_zone": true,
            "AStroWorld_Cn9OuUNTZRfuaCnwc6:ip_address": true,
            "AStroWorld_Cn9OuUNTZRfuaCnwc6:date": true
        }
    },
    {
        "id": "S565ds6887df646k5Y4f56IOiDWxRXS840lnnmD",
        "perms": {
            "s564d68a34dCn9OuUNTZRfuaCnwc6:feed": true,
            "s564d68a34dCn9OuUNTZRfuaCnwc6:history.readwrite": true
        }
    }
];
const randomThings = {
    images: {
        brokenImage: 'https://www.materialui.co/materialIcons/image/broken_image_black_192x192.png'
    }
};
const mongoClient = MongoClient.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(db => db.db("auth"));

router.get('/api/user/apps', (req, res) => {
    const default_account = getAppCookies(req)['default_account'] != null || undefined ? JSON.parse(decodeURIComponent(getAppCookies(req)['default_account'])) : "";
    const
        username = default_account.username,
        password = default_account.password;

    mongoClient
        .then(async (db) => {
            db.collection("users").findOne({
                username: username,
                password: password
            }).then((result) => {
                const api_ids = [];
                result.allowed_apps.map((v, i) => {
                    api_ids.push(Object.keys(v.perms))
                });
                res.json(api_ids.flat());
            }).catch(e => res.status(500).json(e))
        }).catch(e => res.status(500).json(e))
});

router.get('/app/:appid/info', (req, res) => {
    mongoClient.then(db => {
        db.collection("clients_app").findOne({app_id: req.params.appid})
            .then(app => ({_id, app_secret, ...object} = app, res.json(object)))
            .catch(e => res.json(e))
    }).catch(e => res.json(e))
});
router.post('/generate_apps_perms', (req, res) => {
    if (!req.headers.default_account) return res.status(400).json('Username Or Password Missing');
    let default_account = JSON.parse(req.headers.default_account);
    //const default_account = getAppCookies(req)['default_account'] != null || undefined ? JSON.parse(decodeURIComponent(getAppCookies(req)['default_account'])) : "";
    default_account ? mongoClient.then(db => {
        db.collection("users").findOne({username: default_account.username, password: default_account.password})
            .then(userData => {
                if (!userData) return res.status(400).json('User Not Found');
                const
                    perms = userData.allowed_apps,
                    appIds = perms.map(app => app.id),
                    apiIds = perms.map(app => Object.keys(app.perms)).flat().map(v => v.split(':')[0]).filter((a, i, ar) => ar.indexOf(a) === i);

                db.collection("clients_app").find({
                    app_id: {
                        $in: [...appIds]
                    }
                }).toArray()
                    .then(apps => db.collection("clients_api").find({
                        client_public: {
                            $in: [...apiIds]
                        }
                    }).toArray().then(apis => {
                        res.json(apps.map(app => {
                            const
                                permsForApp = perms.find(a => a.id === app.app_id),
                                permsCreated = Object.keys(permsForApp.perms).map(key => {
                                    const currentPerm = apis.find(api => api.client_public === key.split(":")[0]);
                                    return ({
                                        title: currentPerm.grant_desc[key],
                                        provider: currentPerm.name,
                                        icon: currentPerm.app_icon,
                                        api_id: currentPerm.client_public,
                                        grant: key
                                    })
                                });
                            return {
                                appId: app.app_id,
                                icon: app.app_icon || randomThings.images.brokenImage,
                                appName: app.name,
                                perms: [...permsCreated],
                                appCallback: app.callback
                            };
                        }));
                    }))
            })
    }).catch(e => res.json(e)) : res.status(400).json('Default Account Not Found');
});
router.post('/remove_oauth_app', (req, res) => {
    if (!req.headers.default_account || !req.headers.app_id) return res.status(400).json('Username Or Password Missing');
    let default_account = JSON.parse(req.headers.default_account);
    default_account ? mongoClient.then(db => {
        db.collection("users").findOne({
            username: default_account.username,
            password: default_account.password
        }).then(account => {
            db.collection("users").updateOne({
                user_id: account.user_id
            }, {
                allowed_apps: [...account.allowed_apps.filter(item => item.id !== req.headers.app_id)]
            }).then(() => res.json('Updated'))
        }).catch(e => res.status(400).json(e))
    }).catch(e => res.status(400).json(e)) : (res.status(400).json('An Error Occured'));
});

module.exports = router;

