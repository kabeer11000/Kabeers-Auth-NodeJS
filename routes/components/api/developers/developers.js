const express = require('express'),
    router = express.Router(),
    mongo = require('mongodb'),
    path = require('path'),
    MongoClient = mongo.MongoClient,
    url = require('url'),
    jwt = require('jsonwebtoken'),
    mongo_uri = require('../../../.././keys/mongo_key');

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function CheckIsValidDomain(domain) {
    const re = new RegExp(/^((?:(?:(?:\w[.\-+]?)*)\w)+)((?:(?:(?:\w[.\-+]?){0,62})\w)+)\.(\w{2,6})$/);
    return domain.match(re);
}

/* GET home page. */
router.get('/', (req, res) => {
    res.status(200).json('Found')
});
/* GET home page. */
router.post('/apps/all', (req, res) => {
    if (
        !req.body.username ||
        !req.body.password
    ) {
        res.status(400).json('Some Params Were Missing');
    } else {
        const
            username = req.body.username,
            password = req.body.password;

        MongoClient.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true})
            .then((db, err) => {
                if (err) {
                    res.json('Cannot Connect to DB');
                }
                const dbo = db.db("auth");
                dbo.collection("users").findOne({
                    username: username,
                    password: password,
                }).then((result, err) => {
                    if (err) res.status(400).json('User Not Found');
                    if (result) {
                        dbo.collection("clients_app").find({
                            developer: result.user_id,
                        })
                            .toArray()
                            .then((result, err) => {
                                if (err) res.status(400).json('User Not Found');
                                if (result) {
                                    res.status(200).json(result);
                                }
                            });
                    }
                })
            });

    }
});

router.post('/add_app', function (req, res, next) {
    if (
        !req.body.username ||
        !req.body.password ||
        !req.body.app_name ||
        !req.body.callback_domain ||
        CheckIsValidDomain(decodeURIComponent(req.body.callback_domain))
    ) {
        res.status(400).json('Some Params Were Missing');
    } else {
        const
            appName = decodeURIComponent(escape(req.body.app_name)),
            callbackDomain = decodeURIComponent(req.body.callback_domain),
            username = req.body.username,
            password = req.body.password;


        MongoClient.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true})
            .then((db, err) => {
                if (err) {
                    res.json('Cannot Connect to DB');
                }
                const dbo = db.db("auth");
                dbo.collection("users").findOne({
                    username: username,
                    password: password,
                }).then((result, err) => {
                    if (err) res.status(400).json('User Not Found');
                    if (result) {
                        const
                            app_id = makeid(40),
                            app_secret = makeid(40);

                        dbo.collection("clients_app").insertOne({
                            name: appName,
                            app_id: app_id,
                            app_secret: app_secret,
                            callback_domain: callbackDomain,
                            developer: result.user_id,
                            verified: false
                        }, function (err, result) {
                            if (err) res.json(err);
                            if (result) {
                                res.json({
                                    app_name: appName,
                                    status: "unverified",
                                    client_public: app_id,
                                    client_secret: Buffer.from(app_secret).toString('base64'),
                                    developer_id: result.user_id
                                });
                            }
                        })
                    }
                });
            });
    }
});

module.exports = router;
