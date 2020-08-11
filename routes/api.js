var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

const json__ = {
    "TotalLibs": 19,
    "Libs":
        [
            {
                "name": "AngularJS",
                "hash": "c4000376114184b38e2f00e43b070a9fe239457d",
                "desc": "AngularJS extends HTML with new attributes.AngularJS is perfect for Single Page Applications (SPAs).AngularJS is easy to learn.",
                "icon": "http://z3b2j7q2.hostrycdn.com/assets/images/icons/angular-icon.svg",
                "links": [{
                    "name": "JS",
                    "type": "JS",
                    "link": "http://z3b2j7q2.hostrycdn.com/CDNs/AngularJS/angular1.6.9.min.js"
                }]
            },
            {
                "name": "Brain.js",
                "hash": "0964f7fb0dfd13301cad78c658ab700809a25226",
                "desc": "Brain.js is a GPU accelerated library of Neural Networks written in JavaScript for Browsers and Node.js. It is simple, fast and easy to use..",
                "icon": "http://z3b2j7q2.hostrycdn.com/assets/images/icons/brainjs-icon.png",
                "links": [{
                    "name": "JS",
                    "type": "JS",
                    "link": "http://z3b2j7q2.hostrycdn.com/CDNs/Brain.js-1.1.2/Brain.js"
                }]
            },
            {
                "name": "Bootstrap Framework",
                "hash": "abb680e8f9be0433c29d2a725b972952680edf55",
                "desc": "Get started with Bootstrap, the world’s most popular framework for building responsive, mobile-first sites, with BootstrapCDN and a template starter page.",
                "icon": "http://z3b2j7q2.hostrycdn.com/assets/images/icons/bootstrap-icon.webp",
                "links": [{
                    "name": "CSS",
                    "type": "CSS",
                    "link": "http://z3b2j7q2.hostrycdn.com/CDNs/Bootstrap-4.2.4/Css/bootstrap.css"
                }, {
                    "name": "JS",
                    "type": "JS",
                    "link": "http://z3b2j7q2.hostrycdn.com/CDNs/Bootstrap-4.2.4/js/bootstrap.js"
                }]
            },
            {
                "name": "W3 Framework",
                "hash": "6e382f29142828da0b554102d5a2a0537862becc",
                "desc": "W3.CSS is a modern CSS framework with built-in responsiveness. It supports responsive mobile first design by default, and it is smaller and faster than similar CSS frameworks. W3.CSS can also speed up and simplify web development because it is easier to learn, and easier to use than other CSS frameworks.",
                "icon": "http://z3b2j7q2.hostrycdn.com/assets/images/icons/w3schools-icon.jpg",
                "links": [{
                    "name": "CSS",
                    "type": "CSS",
                    "link": "http://z3b2j7q2.hostrycdn.com/CDNs/W3-CSS/W3.CSS"
                }, {"name": "JS", "type": "JS", "link": "http://z3b2j7q2.hostrycdn.com/CDNs/W3-JS/w3.js"}]
            },
            {
                "name": "Proper JS",
                "hash": "067e4d9c2d5920efd66b8dd7453467e9606dae65",
                "desc": "Tooltip & popover Positioning engine Weighs just 3 kb!.",
                "icon": "http://z3b2j7q2.hostrycdn.com/assets/images/icons/properjs-icon.svg",
                "links": [{
                    "name": "JS",
                    "type": "JS",
                    "link": "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
                }]
            },
            {
                "name": "JQuery JS",
                "hash": "bfdc0c53d3275d1008552223bc3e1576aabb33d9",
                "desc": "jQuery is a fast, small, and feature-rich JavaScript library. It makes things like HTML document traversal and manipulation, event handling, animation, and Ajax much simpler with an easy-to-use API that works across a multitude of browsers.",
                "icon": "http://z3b2j7q2.hostrycdn.com/assets/images/icons/jquery-icon.png",
                "links": [{"name": "JS", "type": "JS", "link": "https://code.jquery.com/jquery-3.3.1.slim.min.js"}]
            },
            {
                "name": "React JS",
                "hash": "102cef84e3a746aeb38eb7955a1b346bfd632c29",
                "desc": "React is an open-source JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies.",
                "icon": "http://z3b2j7q2.hostrycdn.com/assets/images/icons/react-icon.svg",
                "links": [{
                    "name": "React JS",
                    "type": "JS",
                    "link": "https://unpkg.com/react@16/umd/react.production.min.js"
                }, {
                    "name": "React Dom",
                    "type": "JS",
                    "link": "https://unpkg.com/react@16/umd/react-dom.production.min.js"
                }]
            },
            {
                "name": "Infinite Scroll JS",
                "hash": "7d372ed8447f8431eb9a923a886df2b0219e4239",
                "desc": "Infinite Scroll is a JavaScript plugin that automatically adds the next page, saving users from a full page load. You’ve likely seen it in use all over the web.",
                "icon": "http://z3b2j7q2.hostrycdn.com/assets/images/icons/infinitescroll-icon.svg",
                "links": [{
                    "name": "JS",
                    "type": "JS",
                    "link": "http://z3b2j7q2.hostrycdn.com/CDNs/Infinite-Scroll/infinite-scroll.pkgd.min.js"
                }]
            },
            {
                "name": "Chart JS",
                "hash": "e10a365f39dc8e5293eb0c9a06e25d1691556d9f",
                "desc": "Simple HTML5 charts using the canvas element. charts",
                "icon": "https://www.chartjs.org/img/chartjs-logo.svg",
                "links": [{
                    "name": "CSS",
                    "type": "CSS",
                    "link": "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.css"
                }, {
                    "name": "JS",
                    "type": "JS",
                    "link": "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js"
                }]
            },
            {
                "name": "Three JS",
                "hash": "f85703130b0ae4b0b1b77c422ecb9a48c3e3651c",
                "desc": "Three.js is a cross-browser JavaScript library and application programming interface used to create and display animated 3D computer graphics in a web browser. Three.js uses WebGL. The source code is hosted in a repository on GitHub.",
                "icon": "https://pbs.twimg.com/profile_images/1156268573137833984/5gdpZtDv_400x400.jpg",
                "links": [{
                    "name": "JS",
                    "type": "JS",
                    "link": "https://cdnjs.cloudflare.com/ajax/libs/three.js/r99/three.min.js"
                }]
            },
            {
                "name": "Material Web Framework",
                "hash": "4c155256f9dd71cf03f7ff196d371f50f40a86fa",
                "desc": "Material Design takes a mobile-first approach and the design practice is widely used in Google products like Android. ... The goal of the Material design, according to Google, is to develop a single underlying system that allows for a unified experience across platforms and device sizes.",
                "icon": "https://material.io/resources/icons/static/ic_material_192px_light.svg",
                "links": [{
                    "name": "CSS",
                    "type": "CSS",
                    "link": "https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css"
                }, {
                    "name": "JS",
                    "type": "JS",
                    "link": "https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"
                }, {
                    "name": "Material Icons",
                    "type": "CSS",
                    "link": "https://fonts.googleapis.com/icon?family=Material+Icons"
                }]
            },
            {
                "name": "Kabeers Auto Attr JS",
                "hash": "95c805dcb60ec56d97d2b29e1987c374f1767f22",
                "desc": "Kabeers Auto Attr JS is a compact Javascript Library to Auto Add attributes to Elements in bulk. For example writing bootstrap Code you might write:",
                "icon": "http://docs-kabeersnetwork-kview-app-sta.rf.gd/Private/uploads/5ee242b4637d4---download.png",
                "links": [{
                    "name": "Development JS V1.0.1",
                    "type": "JS",
                    "link": "http://docs-kabeersnetwork-kview-app-sta.rf.gd/cdn/auto-attr/1.0.1/auto-attr.js"
                }, {
                    "name": "Production JS V1.0.1",
                    "type": "JS",
                    "link": "http://docs-kabeersnetwork-kview-app-sta.rf.gd/cdn/auto-attr/1.0.1/auto-attr.prod.min.js"
                }]
            },
            {
                "name": "Loading Bar JS",
                "hash": "7c9d6bcde15383bed82a08785b7fc74e419e8ce9",
                "desc": "LoadingBar.js is a highly flexible, open sourced progress bar library based on SVG.",
                "icon": "http://docs-kabeersnetwork-kview-app-sta.rf.gd/Private/uploads/5ee612635c459---favicon-32x32.png",
                "links": [{
                    "name": "CSS",
                    "type": "CSS",
                    "link": "http://docs-kabeersnetwork-kview-app-sta.rf.gd/Private/uploads/5ee610cb30a7bloading-bar.min.css"
                }, {
                    "name": "JS",
                    "type": "JS",
                    "link": "http://docs-kabeersnetwork-kview-app-sta.rf.gd/Private/uploads/5ee610cb348eeloading-bar.min.js"
                }]
            },
            {
                "name": "Swiper JS",
                "hash": "6c516ef0b50c2d1e34adca1fabb0ab50bb273dca",
                "desc": "Swiper is the most modern free mobile touch slider with hardware accelerated transitions and amazing native behavior. It is intended to be used in mobile websites, mobile web apps, and mobile native/hybrid apps.",
                "icon": "http://docs-kabeersnetwork-kview-app-sta.rf.gd/Private/uploads/5ee7357d40c80---logo.svg",
                "links": [{
                    "name": "JS",
                    "type": "JS",
                    "link": "http://docs-kabeersnetwork-kview-app-sta.rf.gd/Private/uploads/5ee736598bae6---swiper.5.4.3.min.js"
                }]
            },
            {
                "name": "Ekko Lightbox",
                "hash": "cb1cb94164a10fa702c09aa0f3e2fd3f8e77a73e",
                "desc": "A lightbox gallery plugin for Bootstrap 3 based on the modal plugin. lightbox, gallery, bootstrap, jquery, modal",
                "icon": "http://docs-kabeersnetwork-kview-app-sta.rf.gd/Private/uploads/5ef051b1afb45---download.png",
                "links": [{
                    "name": "JS",
                    "type": "JS",
                    "link": "https://cdnjs.cloudflare.com/ajax/libs/ekko-lightbox/5.3.0/ekko-lightbox.min.js"
                }, {
                    "name": "CSS + MAP",
                    "type": "CSS",
                    "link": "https://cdnjs.cloudflare.com/ajax/libs/ekko-lightbox/5.3.0/ekko-lightbox.css"
                }]
            },
            {
                "name": "KSwipe JS",
                "hash": "115ddc80c60b44312ad8fbee7c9488e8fd3f873a",
                "desc": "Detect Swipe From IOS Android and PC right in your browser.",
                "icon": "http://docs-kabeersnetwork-kview-app-sta.rf.gd/Private/uploads/5efa0ddddbd69---download%20(1).png",
                "links": [{
                    "name": "Dev JS",
                    "type": "JS",
                    "link": "http://ajax-libs.kabeersnetwork.rf.gd/libs/kswipejs/0.0.1/kswipejs/dist/kswipe.js"
                }, {
                    "name": "Minified JS",
                    "type": "JS",
                    "link": "http://ajax-libs.kabeersnetwork.rf.gd/libs/kswipejs/0.0.1/kswipejs/dist/kswipe.js"
                }]
            },
            {
                "name": "K Avatar JS",
                "hash": "ee4f5327be4c5a08ffbc45154ed88a61371d3349",
                "desc": "Auto Generate User Avatars From Names.",
                "icon": "http://docs-kabeersnetwork-kview-app-sta.rf.gd/Private/uploads/5f04492bbebef---download.png",
                "links": [{
                    "name": "Dev JS",
                    "type": "JS",
                    "link": "https://cdn.jsdelivr.net/gh/kabeer11000/avatar-js/dist/avatar.js"
                }, {
                    "name": "Minified JS",
                    "type": "JS",
                    "link": "https://cdn.jsdelivr.net/gh/kabeer11000/avatar-js/dist/avatar.min.js"
                }]
            },
            {
                "name": "K Auth SDK JS <small>1.0.0</small>",
                "hash": "e0f67ea4cdcecf2e0936fbfe9b8b7673f0385efa",
                "desc": "Kabeers Auth API JavaScript SDK",
                "icon": "https://cdn.worldvectorlogo.com/logos/google-domains.svg",
                "links": [{
                    "name": "Dev JS",
                    "type": "JS",
                    "link": "https://cdn.jsdelivr.net/gh/kabeer11000/kauthsdk-js@master/src/kauthsdk-compiled.js"
                }, {
                    "name": "Minified JS",
                    "type": "JS",
                    "link": "https://cdn.jsdelivr.net/gh/kabeer11000/kauthsdk-js/dist/kauthsdk.min.js"
                }]
            }
        ]
};
/* GET home page. */
router.get('/:jwt', function (req, res, next) {
    jwt.verify(req.params.jwt, '9B113DD29D8C85EDD7E15E182A1E8', function (err, decoded) {
        res.json(decoded);
    });
});

module.exports = router;
