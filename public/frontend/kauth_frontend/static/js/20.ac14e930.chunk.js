(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{117:function(e,t,n){"use strict";n.d(t,"d",function(){return s}),n.d(t,"a",function(){return d}),n.d(t,"c",function(){return f}),n.d(t,"b",function(){return p});var a=n(18),r=n.n(a),c=n(111),o=n(31),i=n(22),u=n(32),l=n(147),s=(n(0),function(){var e=Object(o.a)(r.a.mark(function e(t){var n,a,l,s,d,f=arguments;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(n=f.length>1&&void 0!==f[1]&&f[1],a=document.getElementById("DataContainer"),l={authCode:a.getAttribute("authCode"),clientPublic:a.getAttribute("clientPublic")},a){e.next=5;break}return e.abrupt("return",new Error("Main Element Not Defined"));case 5:return s=function(){var e=Object(o.a)(r.a.mark(function e(){var t,n=arguments;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=n.length>0&&void 0!==n[0]?n[0]:{},e.abrupt("return",fetch(t.url,Object(c.a)({},t)).then(function(e){return e.ok?e.json():null}));case 2:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),d=function(){var e=Object(o.a)(r.a.mark(function e(){var t;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=void 0,e.next=3,s({url:u.a.authToken,method:"POST",timeout:0,headers:{"Content-Type":"application/x-www-form-urlencoded"},body:Object(i.d)({client_secret:Object(i.e)("client_secret"),client_public:l.clientPublic,auth_code:l.authCode})}).then(function(e){t=e});case 3:return e.abrupt("return",t);case 4:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),e.abrupt("return",s({url:u.a.authAllow,method:"POST",timeout:0,headers:{Accept:"application/json","Content-Type":"application/x-www-form-urlencoded"},body:Object(i.d)({username:t.username,password:t.password,auth_code:l.authCode})}).then(function(e){if(e){if("code"===Object(i.e)("response_type")){var t=new URLSearchParams(e.callback);if(n)return{callback:e.callback.split(/[?#]/)[0],state:t.get("state"),nonce:t.get("nonce")};window.location.href=e.callback}if("token"===Object(i.e)("response_type")){var a=new URLSearchParams(e.callback);return d().then(function(t){if(t)return n?{callback:e.callback.split(/[?#]/)[0],token:JSON.stringify(t),state:a.get("state"),nonce:a.get("nonce")}:void(window.location.href="".concat(e.callback.split(/[?#]/)[0],"?token=").concat(encodeURI(JSON.stringify(t)),"&nonce=").concat(a.get("nonce"),"&state=").concat(a.get("state")))})}}}).catch(function(e){return new Error("Error Response")}));case 8:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()),d=function(){var e=Object(o.a)(r.a.mark(function e(t){var n,a=arguments;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=a.length>1&&void 0!==a[1]&&a[1],e.abrupt("return",l.a.load().then(function(e){return e.get().then(function(e){return fetch(u.a.chooserLoginTest(n),{credentials:"include",method:"POST",headers:{Accept:"application/json","Content-Type":"application/x-www-form-urlencoded"},timeout:0,body:Object(i.d)(Object(c.a)({deviceId:e.visitorId},n?{user_id:t.user_id,session_token:t.session_token}:{username:t.username,password:t.password}))})})}));case 2:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),f={sendUpdateEmail:function(){var e=Object(o.a)(r.a.mark(function e(t){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",fetch(u.a.UserDevicesSendEmail,{method:"POST",timeout:0,headers:{Accept:"application/json","Content-Type":"application/x-www-form-urlencoded"},body:Object(i.d)({username:t.username,password:t.password})}));case 1:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),sendUpdateRequest:function(){var e=Object(o.a)(r.a.mark(function e(t,n,a){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(u.a.UserDevicesUpdate,{method:"POST",timeout:0,headers:{Accept:"application/json","Content-Type":"application/x-www-form-urlencoded"},body:Object(i.d)({username:t.username,password:t.password,code:n,deviceId:a})});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}));return function(t,n,a){return e.apply(this,arguments)}}()},p=function(e){return l.a.load().then(function(t){return t.get().then(function(t){return fetch(u.a.GetClientInfo).then(function(e){return e.json()}).then(function(n){return fetch(u.a.CreateAccount,{method:"POST",timeout:0,headers:{Accept:"application/json","Content-Type":"application/x-www-form-urlencoded"},body:Object(i.d)(Object(c.a)({},n,e,{deviceId:t.visitorId}))}).then(function(e){return e.json()})})})})}},129:function(e,t,n){"use strict";n.d(t,"a",function(){return u});var a=n(18),r=n.n(a),c=n(111),o=n(31),i=n(142),u=function(){var e=Object(o.a)(r.a.mark(function e(t){var n;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t){e.next=2;break}return e.abrupt("return",new Error("No Account"));case 2:if(null!==localStorage.getItem(i.a.accounts)){e.next=6;break}return e.abrupt("return",localStorage.setItem(i.a.accounts,JSON.stringify([Object(c.a)({},t,{password:void 0})])));case 6:if((n=JSON.parse(localStorage.getItem(i.a.accounts))).find(function(e){return e.user_id===t.user_id})){e.next=11;break}return e.abrupt("return",(n.push(Object(c.a)({},t,{password:void 0})),localStorage.setItem(i.a.accounts,JSON.stringify(n))));case 11:return e.abrupt("return",(n[n.findIndex(function(e){return e.user_id===t.user_id})]=Object(c.a)({},t,{password:void 0}),localStorage.setItem(i.a.accounts,JSON.stringify(n))));case 12:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()},142:function(e,t,n){"use strict";n.d(t,"a",function(){return o});var a=n(18),r=n.n(a),c=n(31),o={accounts:"26f2aba545fda02c0f705960ff93fe70"};Object(c.a)(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",null===localStorage.getItem("accounts")?null:localStorage.removeItem("accounts"));case 1:case"end":return e.stop()}},e)}))()},205:function(e,t,n){},206:function(e,t,n){},212:function(e,t,n){},323:function(e,t,n){"use strict";n.r(t);var a=n(17),r=n(0),c=n.n(r),o=(n(205),n(156)),i=n(332),u=n(296),l=n(330),s=n(163),d=n(101),f=n(176),p=n(26),m=Object(r.lazy)(function(){return Promise.all([n.e(0),n.e(15),n.e(25)]).then(n.bind(null,307))}),b=function(e){return c.a.createElement(r.Suspense,{fallback:c.a.createElement(p.default,null)},c.a.createElement(m,e))},h=Object(r.lazy)(function(){return Promise.all([n.e(0),n.e(2),n.e(4),n.e(21)]).then(n.bind(null,308))}),v=function(e){return c.a.createElement(r.Suspense,{fallback:c.a.createElement(p.default,null)},c.a.createElement(h,e))},g=n(100),w=n(103),E=n(128),O=n.n(E),j=n(18),y=n.n(j),S=n(31),k=(n(206),n(117)),x=n(22),I=n(129),N=n(38),P=n(126),A=function(e){var t=c.a.useState(),n=Object(a.a)(t,2),o=n[0],i=n[1],u=c.a.useContext(N.a),l=Object(a.a)(u,2),s=(l[0],l[1]);return Object(r.useEffect)(function(){var t=JSON.parse(x.c.getCookie("default_account"));Object(k.a)(t).then(function(e){return e.json()}).then(function(){var n=Object(S.a)(y.a.mark(function n(a){return y.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:if(69!==a.status){n.next=5;break}return s(t),n.next=4,k.c.sendUpdateEmail(t);case 4:return n.abrupt("return",e.handleDeviceVerification(1));case 5:if(200===a.status){n.next=7;break}return n.abrupt("return",i(c.a.createElement("div",null,"This Kabeers Auth Session Faced Internal Server Error")));case 7:if("Nothing Found"===a){n.next=10;break}return n.next=10,Object(I.a)(a).then(function(){return Object(k.d)(a).catch(function(e){return i(c.a.createElement("div",null,"This Kabeers Auth Session Faced Internal Server Error"))})});case 10:case"end":return n.stop()}},n)}));return function(e){return n.apply(this,arguments)}}()).catch(function(e){return i(c.a.createElement("div",null,"This Kabeers Auth Session Faced Internal Server Error"))})},[]),document.title="Redirecting you to ".concat(x.a.getAttribute("appName"),". Please wait..."),c.a.createElement("div",{className:"AutoRedirectScreen"},c.a.createElement(p.default,null),c.a.createElement("div",{style:{marginTop:"30%",display:"flex",flexDirection:"column",alignItems:"center"}},c.a.createElement("br",null),c.a.createElement(d.a,{variant:"caption"},"Redirecting You to ",c.a.createElement("b",null,x.a.getAttribute("appName"))),o))};A.defaultProps={};var C=Object(P.a)(A),T=n(334),_=n(324),D=Object(r.lazy)(function(){return Promise.all([n.e(0),n.e(2),n.e(4),n.e(22)]).then(n.bind(null,309))}),R=function(e){return c.a.createElement(r.Suspense,{fallback:null},c.a.createElement(D,e))},J=n(260),U=n(142),V=function(e){var t=e.children,n=e.value,a=e.index,r=Object(f.a)(e,["children","value","index"]);return c.a.createElement("div",Object.assign({role:"tabpanel",hidden:n!==a,id:"simple-tabpanel-".concat(a),"aria-labelledby":"simple-tab-".concat(a)},r),n===a&&c.a.createElement(T.a,{p:0},t))},F=Object(J.a)(function(e){var t=document.getElementById("DataContainer");if(!t)throw new Error('"MainElement" Not Defined');var n=t.getAttribute("promptType"),r=c.a.useState(0),o=Object(a.a)(r,2),i=o[0],u=o[1],l=c.a.useContext(N.a),f=Object(a.a)(l,2),p=(f[0],f[1],function(e){u(e)}),m=null===localStorage.getItem(U.a.accounts)?null:JSON.parse(localStorage.getItem(U.a.accounts));return c.a.createElement(c.a.Fragment,null,c.a.createElement(_.a,{onChange:p,value:i}),c.a.createElement(V,{index:0,value:i},function(){switch(n){case"chooser":return m&&m.length?c.a.createElement(b,Object.assign({},e,{handleDeviceVerification:p})):c.a.createElement(v,Object.assign({},e,{handleDeviceVerification:p}));case"password":return c.a.createElement(v,Object.assign({},e,{handleDeviceVerification:p}));case"consent":return m&&m.length?c.a.createElement(b,Object.assign({},e,{handleDeviceVerification:p})):c.a.createElement(v,Object.assign({},e,{handleDeviceVerification:p}));case"none":return O.a.get("default_account")?c.a.createElement(C,Object.assign({handleDeviceVerification:p},e)):m&&m.length?c.a.createElement(b,Object.assign({},e,{handleDeviceVerification:p})):c.a.createElement(v,Object.assign({},e,{handleDeviceVerification:p}));default:return c.a.createElement(c.a.Fragment,null,function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"Invalid Authentication Parameters",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:c.a.createElement("div",null,"Please Contact Site Owner if Problem Persists. If you are owner of this site Please Add Required Parameters for ",c.a.createElement("code",null,"response_type=token"));return c.a.createElement("div",null,c.a.createElement(g.a,{component:"main",className:"pb-2",maxWidth:"xs"},c.a.createElement("div",{className:"errorPage text-center",style:{position:"absolute",top:"40%",left:"50%",width:"90vw",transform:"translate(-50%, -50%)"}},c.a.createElement("div",{className:"mb-3 d-inline-flex justify-content-center"},c.a.createElement(w.a,{src:"https://cdn.worldvectorlogo.com/logos/google-domains.svg",alt:"Kabeers Network Logo"})),c.a.createElement("br",null),c.a.createElement("div",null,c.a.createElement(d.a,{variant:"body1",className:"mb-3"},e),c.a.createElement(d.a,{variant:"caption"},t)))))}("Invalid Auth Request",c.a.createElement("div",null,"Try Clearing Accounts And Signing in Again",c.a.createElement("br",null),c.a.createElement(s.a,{onClick:function(){localStorage.removeItem(U.a.accounts),window.location.reload()}},"Clear"))))}}()),c.a.createElement(V,{index:1,value:i},c.a.createElement(R,e)))}),K=Object(r.lazy)(function(){return Promise.all([n.e(0),n.e(16),n.e(28)]).then(n.bind(null,310))}),z=function(e){return c.a.createElement(r.Suspense,{fallback:null},c.a.createElement(K,e))},B=n(78),L=n(111),q=(n(212),n(213)),Y=n(165),M=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Object(L.a)({},e,{direction:"down",appear:!1}),t=e.children,n=e.window,a=Object(q.a)({target:n?n():void 0});return c.a.createElement(Y.a,{appear:e.appear,direction:e.direction,in:!a},t)};M.defaultProps={};var G=Object(P.a)(M),W=n(215),H=n(3),Q=Object(o.a)(function(e){return{root:{width:"100%"},button:{marginRight:e.spacing(1)},instructions:{marginTop:e.spacing(1),marginBottom:e.spacing(1)}}}),X=function(e){var t=Q(),n=c.a.useState(0),r=Object(a.a)(n,2),o=r[0],f=r[1],p=c.a.useState(new Set),m=Object(a.a)(p,2),b=m[0],h=m[1],v=["Sign In","Allow App"],g=function(e){return b.has(e)},w=function(){var e=b;g(o)&&(e=new Set(e.values())).delete(o),f(function(e){return e+1}),h(e)},E=function(){f(function(e){return e-1})};return c.a.createElement("div",{className:t.root},c.a.createElement(G,null,c.a.createElement(i.a,{activeStep:o,className:"fixed-top",elevation:2},v.map(function(e,t){var n={},a={};return g(t)&&(n.completed=!1),c.a.createElement(u.a,Object.assign({key:e},n),c.a.createElement(l.a,a,e))}))),c.a.createElement("div",null,o===v.length?c.a.createElement("div",null,c.a.createElement(d.a,{className:t.instructions},c.a.createElement("div",{className:"text-center"},c.a.createElement(B.a,null),c.a.createElement("br",null),c.a.createElement(d.a,null,"You are being Redirected to the app"))),c.a.createElement(s.a,{onClick:function(){f(0)},className:t.button},"Reset")):c.a.createElement("div",null,function(e){switch(e){case 0:return c.a.createElement(F,{callNext:w,callBack:E});case 1:return c.a.createElement(z,null);case 2:return"This is the bit I really care about!";default:return"Unknown step"}}(o))),c.a.createElement("div",{className:"d-none"},c.a.createElement(d.a,{variant:"body2",color:"textSecondary",align:"center"},"Copyright \xa9 ",c.a.createElement(W.a,{color:"inherit",href:"http://kabeersnetwork.dx.am"},"Kabeers Network")," ",(new Date).getFullYear(),".")))};X.defaultProps={};t.default=Object(H.e)(Object(P.a)(X))}}]);
//# sourceMappingURL=20.ac14e930.chunk.js.map