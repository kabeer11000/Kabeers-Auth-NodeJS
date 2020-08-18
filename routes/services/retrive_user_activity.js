const express = require('express'),
    router = express.Router(),
    mongo = require('mongodb'),
    path = require('path'),
    MongoClient = mongo.MongoClient,
    url = require('url'),
    jwt = require('jsonwebtoken'),
    mongo_uri = require('../.././keys/mongo_key'),
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
let getIp = (req) => {
    return req.headers['REMOTE_ADDR'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};
router.post('/', function (req, res, next) {
    const
        token = req.body.token,
        user_id = req.body.user_id;


    jwt.verify(token, 'ouHTvT8Ri6Oe5kf4tiNTv1S4VGhua', function (err, decoded) {
        if (err) {
            res.json('Token Expired');
        }
        if (decoded) {
            const
                app_id = decoded.app_id,
                grant_types = decoded.grant_types.split(':');
            MongoClient.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
                if (err) {
                    res.json('Cannot Connect to DB');
                }
                let dbo = db.db("auth");
                dbo.collection("users").findOne({user_id: user_id}, function (err, result) {
                    if (err) res.json(err);
                    if (result) {
                        if (!result.allowed_apps.includes(app_id)) {
                            res.json('App Access Was Not Allowed');
                        } else {
                            dbo.collection("user_data").findOne({user_id: result.user_id}, function (err, user_data) {
                                if (err) res.json(err);
                                if (user_data) {
                                    if (!array_checker("user_id:city:region:country:location:postal:time_zone:ip_address:org".split(':'), grant_types)) {
                                        res.json('Invalid Grant Types');
                                    } else {
                                        const d = {};
                                        const user_data_schema = {
                                            user_id: user_data.user_id,
                                            city: user_data.city,
                                            region: user_data.region,
                                            country: user_data.country,
                                            location: user_data.location,
                                            postal: user_data.postal,
                                            time_zone: user_data.time_zone,
                                            ip_address: user_data.ip_address,
                                            org: user_data.org,
                                        };
                                        grant_types.forEach((v_, i) => {
                                            d[v_] = user_data_schema[v_];
                                        });
                                        res.json(d);
                                    }
                                } else {
                                    res.json('No Data Found For That User');
                                }
                            });
                        }
                    }
                })
            })
        }
    });
});


module.exports = router;
