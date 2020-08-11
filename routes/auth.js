const express = require('express'),
    router = express.Router(),
    mongo = require('mongodb'),
    path = require('path'),
    MongoClient = mongo.MongoClient,
    url = require('url'),
    jwt = require('jsonwebtoken');
var mongo_uri = require('.././keys/mongo_key');

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


router.get('/:app_id/:callback/:grant_type/:remote_app_id', function (req, res, next) {
  if (!req.params.app_id||!req.params.callback||!req.params.grant_type||!req.params.remote_app_id){

  }
    const
        app_id = decodeURIComponent(req.params.app_id),
        grant_type = decodeURIComponent(req.params.grant_type),
        callback = url.parse(decodeURIComponent(req.params.callback)),
        remote_app_id = decodeURIComponent(req.params.remote_app_id);

    MongoClient.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) {
            res.json('Cannot Connect to DB');
        }
        let dbo = db.db("auth");
        dbo.collection("clients_app").findOne({app_id: app_id}, function (err, result) {
            if (err) res.json(err);
            if (result && url.parse(result.callback_domain).host === callback.host && grant_type === 'auth_code') {
                const authCode_id = makeid(13);
                req.session.authCode = remote_app_id + ':' + app_id + ':' + authCode_id;
                res.json(authCode_id);
            } else {
                res.json('Bad Request')
            }
        });
    });
});


router.post('/token', function (req, res) {
    if (!req.body.client_secret || !req.body.client_public || !req.body.auth_code || req.body.auth_code !== req.session.authCode.split(':')[2]) {
        return res.json('Some Params Were Missing');
    }
    const
        app_public = req.body.client_public,
        app_secret = req.body.client_secret,
        auth_code = req.body.auth_code;

    MongoClient.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) {
            res.json('Cannot Connect to DB');
        }
        let dbo = db.db("auth");
        dbo.collection("clients_app").findOne({app_id: app_public, app_secret: app_secret}, function (err, app) {
            if (err) res.json(err);
            if (app) {
                dbo.collection("clients_api").findOne({client_public: req.session.authCode.split(':')[0]}, function (err, api_client) {
                    if (err) console.log(err);
                    if (api_client){
                        res.json(jwt.sign({
                            app_name: app.name,
                            app_id: app.app_id,
                        }, api_client.client_secret, {expiresIn: '1h'}));
                    }else {
                        res.json('App Not Found, Bad Request');
                    }
                });
            } else {
                res.json('Invalid Token, Bad Request');
            }
        });
    });
});


module.exports = router;
