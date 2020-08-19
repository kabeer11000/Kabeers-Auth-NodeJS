const express = require('express'),
    router = express.Router(),
    jwt = require('jsonwebtoken');

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const text = {
    "TotalFolders": 4,
    "Folders": [
        {
            "name": "Random Folder",
            "id": "ef42b8e0388a8ceaa78c6dc127ce2038",
            "shared": "1",
            "owner": "test",
            "dateCreated": "2020-05-31 23:21:09.003038",
            "dateModified": "2020-05-31 23:22:00.360854"
        },
        {
            "name": "A Folder",
            "id": "gds5bc7e15226a9fc9362d692f326d5",
            "shared": "0",
            "owner": "test",
            "dateCreated": "2020-05-31 23:21:09.003038",
            "dateModified": "2020-05-31 23:22:00.360854"
        },
        {
            "name": "Another Folder",
            "id": "8f4c5dfe805005753ce9befe770193a6",
            "shared": "0",
            "owner": "test",
            "dateCreated": "2020-05-31 23:21:09.003038",
            "dateModified": "2020-05-31 23:22:00.360854"
        },
        {
            "name": "My Design Project",
            "id": "243c6e9b86f26723b8f88ad5ccf7cc1f",
            "shared": "0",
            "owner": "test",
            "dateCreated": "2020-05-31 23:21:09.003038",
            "dateModified": "2020-05-31 23:22:00.360854"
        }
    ],
    "TotalFiles": 4,
    "Files": [
        {
            "name": "File.php",
            "id": "5sr0ab16f85c013f24bb1927ea2fe3fe",
            "size": "3831",
            "path": "http://drive.hosted-kabeersnetwork.unaux.com/user-files/asd7f4e64ec60f0186ad643662f8665f8160ab16f85c013f24bb1927ea2fe3fe.php",
            "shared": "1",
            "mime": "text/x-php",
            "owner": "test",
            "thumbnail": "http://docs-kabeersnetwork-kview-app-sta.rf.gd/icons/code.svg",
            "dateCreated": "2020-05-26 19:26:36.610244",
            "dateModified": "2020-05-26 19:26:36.610244"
        },
        {
            "name": "Image.png",
            "id": "bc5e1d62bf9d14f6c77eeff4b389b67f",
            "size": "20688",
            "path": "http://drive.hosted-kabeersnetwork.unaux.com/user-files/cdb6ca4fa21f78d0f89091a877955b2fbc5e1d62bf9d14f6c77eeff4b389b67f.png",
            "shared": "0",
            "mime": "image/png",
            "owner": "test",
            "thumbnail": "http://docs-kabeersnetwork-kview-app-sta.rf.gd/icons/image.svg",
            "dateCreated": "2020-05-28 15:41:33.248536",
            "dateModified": "2020-05-31 23:13:55.376475"
        },
        {
            "name": "Another Image.png",
            "id": "00f5ea354c919saf4d813061b7b20324",
            "size": "20582",
            "path": "http://drive.hosted-kabeersnetwork.unaux.com/user-files/a4c5e81a6b130b88234ed865ca449ed600f5ea354c919b5f4d813061b7b20324.png",
            "shared": "0",
            "mime": "image/png",
            "owner": "test",
            "thumbnail": "http://docs-kabeersnetwork-kview-app-sta.rf.gd/icons/image.svg",
            "dateCreated": "2020-05-28 15:41:33.311608",
            "dateModified": "2020-05-28 15:41:33.311608"
        },
        {
            "name": "Another File.js",
            "id": "19feaaf8c9f6e799b5946810b3d22c79",
            "size": "1787",
            "path": "http://drive.hosted-kabeersnetwork.unaux.com/user-files/232d8bac43970a339d015dc42f677efb19feaaf8c9f6e799b5946810b3d22c79.js",
            "shared": "1",
            "mime": "text/plain",
            "owner": "test",
            "thumbnail": "http://docs-kabeersnetwork-kview-app-sta.rf.gd/icons/js.svg",
            "dateCreated": "2020-05-28 15:46:22.302059",
            "dateModified": "2020-05-28 15:46:22.302059"
        }
    ]
};
router.get('/:jwt', function (req, res, next) {
    jwt.verify(req.params.jwt, 'HLRnfT8Ri6Oe5kf4tiNTv1S4VGhCA', function (err, decoded) {
        if (err) {
            res.json('Token Expired')
        }
        if (decoded && decoded.user_id === 'c4000376114184b38e2f00e43b070a9fe239457d') {
            res.json(text)
        }
    });
});
module.exports = router;
