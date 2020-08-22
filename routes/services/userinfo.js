const express = require('express'),
    router = express.Router(),
    mongo = require('mongodb'),
    MongoClient = mongo.MongoClient,
    jwt = require('jsonwebtoken'),
    mongo_uri = require('../.././keys/mongo_key');

let jwt_secret = 'pornfT8RiOe5kf4tiNTv1S4VGhCA';
let array_checker = (arr, target) => target.every(v => arr.includes(v));

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

router.post('/userinfo', (req, res) => {
    if (!req.body.token) {
        return res.status(400).json('Some Params Were Missing, Bad Request');
    }
    let decoded;
    try {
        decoded = jwt.verify(req.body.token, jwt_secret);
    } catch (err) {
        return res.status(400).json('Token, Invalid Signature');
    }
    if (decoded && Math.floor((Date.now() - decoded.time) / 1000) > 30 || decoded.type !== "access_token") {
        return res.status(400).json('Token Expired');
    }

    const
        grants = decoded.grant_types.split('|');

    let app_ids_from_grants = [], grants_from_grants = [];

    grants.map((value, index) => {
        app_ids_from_grants.push(value.split(':')[0]);
        grants_from_grants.push(value.split(':')[1]);
    });
    app_ids_from_grants = app_ids_from_grants.filter(function (item, pos) {
        return app_ids_from_grants.indexOf(item) === pos;
    });
    MongoClient.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: false}, function (err, db) {
        if (err) {
            res.json('Cannot Connect to DB');
        }
        let dbo = db.db("auth");
        dbo.collection("users").findOne({
            user_id: decoded.user_id,
        }, function (err, basic_info) {
            if (err) res.json(err);
            if (basic_info) {
                const user_result = {
                    username: basic_info.username,
                    email: basic_info.email,
                    account_image: basic_info.account_image,
                    city: basic_info.city,
                    region: basic_info.region,
                    country: basic_info.country,
                    location: {
                        x: basic_info.location.x,
                        y: basic_info.location.y
                    },
                    postal: basic_info.postal,
                    time_zone: basic_info.time_zone,
                    ip_address: basic_info.ip_address,
                    time: basic_info.time,
                    date: basic_info.date
                };
                let user_data = {};
                grants_from_grants.forEach((v_, i) => {
                    user_data[v_] = user_result[v_];
                });
                res.json(user_data);
            } else {
                res.json('Bad Request')
            }
        });
    });
});

module.exports = router;
