const express = require('express'),
    router = express.Router(),
    mongo = require('mongodb'),
    path = require('path'),
    MongoClient = mongo.MongoClient,
    url = require('url'),
    jwt = require('jsonwebtoken'),
    mongo_uri = require('.././keys/mongo_key');

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

router.get('/:app_id/:grant_types/:res_type', function (req, res, next) {
    if (!req.params.app_id || !req.params.grant_types) {
        res.json('Some Params Were Missing, Bad Request');
        throw new Error('Some Params Were Missing');
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
            if (err) res.json(err);
            if (result && req.params.res_type === 'code') {
                const authCode_id = makeid(13);
                const json = {
                    auth_code: authCode_id,
                    app_id: app_id,
                    grant_types: grant_type,
                    time: Date.now(),
                    expires: '2m',
                };
                req.session.authCode = json;
                res.json(json);
            } else {
                res.json('Bad Request')
            }
        });
    });
});

router.post('/token', function (req, res) {
    if (!req.body.client_secret ||
        !req.body.client_public ||
        !req.body.auth_code ||
        req.body.auth_code !== req.session.authCode.auth_code) {
        return res.json('Some Params Were Missing');
    }
    if (Math.floor((Date.now() - req.session.authCode.time) / 1000) > 1020) {
        res.json('AuthCode Expired');
        throw new Error('AuthCode Expired');
    } else {
        const
            app_public = req.body.client_public,
            app_secret = req.body.client_secret,
            grants = req.session.authCode.grant_types.split('|');
        // app_uniqid:username | app_uniqid:password.readonly | app_uniqid2:somthingelse


        let app_ids_from_grants = [];
        let grants_from_grants = [];
        grants.map((value, index) => {
            app_ids_from_grants.push(value.split(':')[0]);
            grants_from_grants.push(value.split(':')[0] + ':' + value.split(':')[1]);
        });
        app_ids_from_grants = app_ids_from_grants.filter(function (item, pos) {
            return app_ids_from_grants.indexOf(item) === pos;
        });
        const operation = (list1, list2, isUnion = false) =>
            list1.filter(a => isUnion === list2.some(b => a === b));
        const inBoth = (list1, list2) => operation(list1, list2, true);
        /*
        res.json({app_ids_from_grants: app_ids_from_grants, grants_from_grants: grants_from_grants});
                res.json({app_ids_from_grants: app_ids_from_grants, grants_from_grants: grants_from_grants});

                var c = [         "FB17A89BB32F42AA1DFAA59D27637",         "A5YWEwZjNlMmZkM2Y4ZTc3YTczZSI",         "A5YWEwZjNlMmZkM2Y4ZTc3YTczZSI",         "A5YWEwZjNlMmZkM2Y4ZTc3YTczZSI"     ];
                let a = [];
                a = c.filter(function(item, pos) {
                    return c.indexOf(item) === pos;
                });
                console.log(a);
                */
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
                                clients_api.map((data, i) => {
                                    let v = data;
                                    let d = {
                                        [v.client_public]: jwt.sign({
                                            app_name: app.name,
                                            app_id: app.app_id,
                                            grant_types: inBoth(grants, v.grant_types.split('|')).join('|'),
                                        }, v.client_secret, {expiresIn: '1h'})
                                    };
                                    tokens.push(d);
                                });
                                res.json(tokens);
                                req.session = null;
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


module.exports = router;
