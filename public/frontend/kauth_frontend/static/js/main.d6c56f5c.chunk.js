(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{22:function(e,t,n){"use strict";n.d(t,"e",function(){return a}),n.d(t,"a",function(){return r}),n.d(t,"d",function(){return o}),n.d(t,"b",function(){return c}),n.d(t,"c",function(){return i});n(18),n(31),n(32);var a=function(e,t){t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");var n=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)").exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null},r=document.getElementById("DataContainer"),o=function(e){var t=[];for(var n in e)e.hasOwnProperty(n)&&t.push(encodeURIComponent(n)+"="+encodeURIComponent(e[n]));return t.join("&")},c=function(e,t,n){var a=new RegExp("([?&])"+t+"=.*?(&|$)","i"),r=-1!==e.indexOf("?")?"&":"?";return e.match(a)?e.replace(a,"$1"+t+"="+n+"$2"):e+r+t+"="+n};var i={getCookie:function(e){for(var t=e+"=",n=decodeURIComponent(document.cookie).split(";"),a=0;a<n.length;a++){for(var r=n[a];" "===r.charAt(0);)r=r.substring(1);if(0===r.indexOf(t))return r.substring(t.length,r.length)}return""},setCookie:function(e,t,n){var a=new Date;a.setTime(a.getTime()+24*n*60*60*1e3);var r="expires="+a.toUTCString();document.cookie=e+"="+t+";"+r+";path=/"}}},26:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=(n(72),n(78)),c=function(){return r.a.createElement("div",{className:"Preloader text-center",style:{width:"10rem",height:"10rem",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"}},r.a.createElement(o.a,null))};c.defaultProps={},t.default=c},32:function(e,t,n){"use strict";n.d(t,"a",function(){return r});var a="".concat(window.location.protocol,"//").concat(window.location.host),r={authAllow:"".concat(a,"/auth/allow"),authToken:"".concat(a,"/auth/token"),chooserLoginTest:function(e){return"".concat(a,"/auth/user/challenge/chooser_login_verification").concat(e?"/c":"")},getSecretFromHash:"".concat(a,"/auth/implict_grant_unhash_secret"),getUserApps:"".concat(a,"/users/api/generate_apps_perms"),removeOauthApp:"".concat(a,"/user/api/remove_oauth_app"),StartInternalOauthFlow:"".concat(a,"/app/start_oauthFlow"),CreateAccount:"".concat(a,"/auth/user/create-account"),VerifyAccount:"".concat(a,"/auth/user/verify"),UserDevicesUpdate:"".concat(a,"/auth/user/devices/update"),UserDevicesSendEmail:"".concat(a,"/auth/user/devices/verify/email"),ServerSavedState:function(e){return"".concat(a,"/auth/user/session/state/").concat(e)},GetClientInfo:"https://json.geoiplookup.io/"}},38:function(e,t,n){"use strict";n.d(t,"a",function(){return c}),n.d(t,"b",function(){return i});var a=n(17),r=n(0),o=n.n(r),c=o.a.createContext(!1),i=function(e){var t=e.children,n=o.a.useState(null),r=Object(a.a)(n,2),i=r[0],l=r[1];return o.a.createElement(c.Provider,{value:[i,l]},t)}},62:function(e,t,n){e.exports=n(77)},67:function(e,t,n){},68:function(e,t,n){},72:function(e,t,n){},77:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(36),c=n.n(o),i=(n(67),n(17)),l=(n(68),n(45)),u=n(3),s=(n(69),n(22)),d=n(26),f=Object(a.lazy)(function(){return Promise.all([n.e(1),n.e(3),n.e(6),n.e(10),n.e(21)]).then(n.bind(null,322))}),m=function(e){return r.a.createElement(a.Suspense,{fallback:r.a.createElement(d.default,null)},r.a.createElement(f,e))},h=n(101),p=n(100),v=n(103),g=Object(a.lazy)(function(){return Promise.all([n.e(1),n.e(17),n.e(26)]).then(n.bind(null,296))}),w=function(e){return r.a.createElement(a.Suspense,{fallback:null},r.a.createElement(g,e))},b=Object(a.lazy)(function(){return Promise.all([n.e(1),n.e(2),n.e(3),n.e(4),n.e(13)]).then(n.bind(null,324))}),E=function(e){return r.a.createElement(a.Suspense,{fallback:r.a.createElement(d.default,null)},r.a.createElement(b,e))},k=n(38),y=n(55),S=n(97),O=n(102),j=Object(a.lazy)(function(){return Promise.all([n.e(6),n.e(27)]).then(n.bind(null,325))}),P=function(e){return r.a.createElement(a.Suspense,{fallback:null},r.a.createElement(j,e))},x=Object(a.lazy)(function(){return Promise.all([n.e(1),n.e(3),n.e(14),n.e(23)]).then(n.bind(null,304))}),C=function(e){return r.a.createElement(a.Suspense,{fallback:null},r.a.createElement(x,e))},_=function(){var e=r.a.useState(!1),t=Object(i.a)(e,2),n=t[0],o=t[1],c=r.a.useState(r.a.createElement("div",null,"Please Contact Site Owner if Problem Persists. If you are owner of this site Please Add Required Parameters for ",r.a.createElement("code",null,"response_type=token"))),d=Object(i.a)(c,2),f=d[0],g=d[1],b=r.a.useState(!0),j=Object(i.a)(b,2),x=j[0],_=(j[1],x?"dark":"light"),A=Object(y.a)({palette:{type:_}});return Object(a.useEffect)(function(){if("token"===Object(s.e)("response_type")&&null===Object(s.e)("client_secret"))return o(!0);window.frameElement&&(g(r.a.createElement("div",null,"Cannot Work When Embedded inside an iframe")),o(!0))},[]),r.a.createElement(S.a,{theme:A},r.a.createElement(O.a,null),r.a.createElement(l.a,null,function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"Invalid Authentication Parameters",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:f;return n?r.a.createElement("div",null,r.a.createElement(p.a,{component:"main",className:"pb-2",maxWidth:"xs"},r.a.createElement("div",{className:"errorPage text-center",style:{position:"absolute",top:"40%",left:"50%",width:"90vw",transform:"translate(-50%, -50%)"}},r.a.createElement("div",{className:"mb-3 d-inline-flex justify-content-center"},r.a.createElement(v.a,{src:"https://cdn.worldvectorlogo.com/logos/google-domains.svg",alt:"Kabeers Network Logo"})),r.a.createElement("br",null),r.a.createElement("div",null,r.a.createElement(h.a,{variant:"body1",className:"mb-3"},e),r.a.createElement(h.a,{variant:"caption"},t))))):null}(),r.a.createElement(k.b,null,r.a.createElement(u.a,{path:["/auth/authorize"],component:s.a.getAttribute("embedded")?C:m}),r.a.createElement(u.a,{path:"/create-account",component:E}),r.a.createElement(u.a,{exact:!0,path:["/home","/","/apps","/profile"]},r.a.createElement(w,null)),r.a.createElement(u.a,{exact:!0,path:["/home","/","/apps","/profile","/settings"]},r.a.createElement(r.a.Fragment,null,r.a.createElement(P,null))))))},A=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function U(e,t){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}}).catch(function(e){console.error("Error during service worker registration:",e)})}c.a.render(r.a.createElement(_,null),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/frontend/kauth_frontend",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",function(){var t="".concat("/frontend/kauth_frontend","/service-worker.js");A?(function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then(function(n){var a=n.headers.get("content-type");404===n.status||null!=a&&-1===a.indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):U(e,t)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}(t,e),navigator.serviceWorker.ready.then(function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")})):U(t,e)})}}()}},[[62,8,9]]]);
//# sourceMappingURL=main.d6c56f5c.chunk.js.map