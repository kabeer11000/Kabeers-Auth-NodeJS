(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{108:function(e,a,t){"use strict";t.d(a,"a",function(){return o});var n=t(1),r=t(0),c=t.n(r),i=t(50);function o(e,a){var t=c.a.memo(c.a.forwardRef(function(a,t){return c.a.createElement(i.a,Object(n.a)({ref:t},a),e)}));return t.muiName=i.a.muiName,t}},117:function(e,a,t){"use strict";var n=t(109);Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var r=n(t(112)),c=t(80),i=n(t(138));var o=function(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return(0,c.makeStyles)(e,(0,r.default)({defaultTheme:i.default},a))};a.default=o},154:function(e,a,t){"use strict";var n=t(1),r=t(2),c=t(0),i=(t(6),t(12)),o=t(183),l=t(9),s=c.forwardRef(function(e,a){var t=e.classes,l=e.className,s=e.raised,u=void 0!==s&&s,m=Object(r.a)(e,["classes","className","raised"]);return c.createElement(o.a,Object(n.a)({className:Object(i.a)(t.root,l),elevation:u?8:1,ref:a},m))});a.a=Object(l.a)({root:{overflow:"hidden"}},{name:"MuiCard"})(s)},169:function(e,a,t){"use strict";var n=t(1),r=t(2),c=t(0),i=(t(6),t(12)),o=t(9),l=c.forwardRef(function(e,a){var t=e.classes,o=e.className,l=e.component,s=void 0===l?"div":l,u=Object(r.a)(e,["classes","className","component"]);return c.createElement(s,Object(n.a)({className:Object(i.a)(t.root,o),ref:a},u))});a.a=Object(o.a)({root:{padding:16,"&:last-child":{paddingBottom:24}}},{name:"MuiCardContent"})(l)},248:function(e,a,t){},249:function(e,a,t){"use strict";var n=t(0),r=t.n(n),c=t(108);a.a=Object(c.a)(r.a.createElement("path",{d:"M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"}),"VerifiedUser")},306:function(e,a,t){"use strict";t.r(a);var n=t(118),r=t(17),c=t(0),i=t.n(c),o=(t(248),t(100)),l=t(189),s=t(78),u=t(103),m=t(249),d=t(101),f=t(317),p=t(295),v=t(117),b=t.n(v),h=t(126),g=t(182),j=t(37),E=t(154),N=t(169),O=t(170),C=t(123),w=t(303),x=t(146),y=t(30),k=b()(function(e){return{paper:{marginTop:e.spacing(6),display:"flex",flexDirection:"column",alignItems:"center"},alignCenter:{display:"flex",flexDirection:"column",alignItems:"center",minWidth:"100%",width:"100%"},avatar:{margin:e.spacing(1),backgroundColor:e.palette.secondary.main},form:{width:"100%",marginTop:e.spacing(1)},submit:{margin:e.spacing(3,0,2)},backdrop:{zIndex:e.zIndex.drawer+1,color:"#fff"}}}),_=function(e){var a=k(),t=i.a.useState({verification_code:""}),c=Object(r.a)(t,2),v=c[0],b=c[1],h=i.a.useState(!1),_=Object(r.a)(h,2),I=_[0],L=_[1],V=i.a.useContext(j.a),z=Object(r.a)(V,2),D=z[0],F=z[1];return i.a.useEffect(function(){document.title="Verify Device to Sign in. Continue to ".concat(y.a.getAttribute("appName"))},[]),i.a.createElement(o.a,{component:"main",maxWidth:"xs",className:"mt5 pt-5"},i.a.createElement(l.a,{className:a.backdrop,open:I},i.a.createElement(s.a,{color:"inherit"})),i.a.createElement(g.a,{in:!0,direction:"left"},i.a.createElement(E.a,{className:a.paper},i.a.createElement(N.a,{className:a.alignCenter},i.a.createElement(u.a,{className:a.avatar},i.a.createElement(m.a,null)),i.a.createElement(d.a,{component:"h1",variant:"h5"},"Verify Device to Login"),i.a.createElement(d.a,{variant:"body2",className:"text-center mt-1"},"A Verification Code has been sent to ",D.email),i.a.createElement(w.a,{className:a.form},i.a.createElement(f.a,{variant:"filled",margin:"normal",required:!0,error:v.username_error,fullWidth:!0,id:"verification_code",label:"Code ex. 555 666",name:"verification_code",autoComplete:"code",autoFocus:!0,inputProps:{maxLength:6},onChange:function(e){e.persist(),b(function(a){return Object(n.a)({},a,{verification_code:e.target.value})})}}),i.a.createElement(p.a,{onClick:function(){return L(!0),O.a.load().then(function(a){return a.get().then(function(a){return C.b.sendUpdateRequest(D,v.verification_code,a.visitorId).then(function(a){return a.ok?a.json().then(function(a){return Object(x.a)(a).then(function(){F(a),L(!1),e.callNext()})}):null}).catch(function(e){return alert("Failed")})}).catch(function(e){return alert("Failed")})}).catch(function(e){return alert("Failed")})},fullWidth:!0,variant:"contained",color:"primary",className:a.submit},"Continue"))))))};_.defaultProps={},a.default=Object(h.a)(_)}}]);
//# sourceMappingURL=19.957af02b.chunk.js.map