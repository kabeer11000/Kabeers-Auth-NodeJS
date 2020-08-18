let mongoose = require('mongoose');
let userActivitySchema = new mongoose.Schema({
    user_id: String,
    city: String,
    region: String,
    country: {
        code: String,
        name: String
    },
    location: {
        x: String,
        y: String,
    },
    postal: String,
    time_zone: String,
    ip_address: String,
    org: String,
});
