(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{250:function(e,a,t){},307:function(e,a,t){"use strict";t.r(a);var n=t(17),r=t(0),c=t.n(r),o=(t(250),t(117)),i=t.n(o),l=t(100),m=t(154),s=t(169),p=t(103),u=t(101),d=t(126),b=t(167),E=t(155),f=t(193),g=t(156),N=t(157),h=t(295),w=t(308),v=t(123),y=t(189),x=t(78),k=t(30),C=t(37),A=t(182),I=i()(function(e){return{root:{width:"100%",maxWidth:"50ch",minWidth:"100%",backgroundColor:e.palette.background.paper},avatar:{margin:e.spacing(1),backgroundColor:e.palette.secondary.main},inline:{display:"inline"},main:{marginTop:e.spacing(8),display:"flex",flexDirection:"column",alignItems:"center"},alignCenter:{display:"flex",flexDirection:"column",alignItems:"center",minWidth:"100%",width:"100%"},backdrop:{zIndex:e.zIndex.drawer+1,color:"#fff"}}}),O=function(e){var a=I(),t=new AbortController;if(!k.a)return new Error("Main Element Not Defined");var o={appName:k.a.getAttribute("appName"),appIcon:k.a.getAttribute("appIcon"),appPerms:JSON.parse(atob(k.a.getAttribute("appPerms")))},i=c.a.useState(!1),d=Object(n.a)(i,2),O=d[0],j=d[1],P=c.a.useContext(C.a),W=Object(n.a)(P,2),T=W[0];W[1];return Object(r.useEffect)(function(){return document.title="Allow ".concat(k.a.getAttribute("appName")," to access your data"),function(){return t.abort()}},[]),c.a.createElement("div",{className:"PermessionsScreen"},c.a.createElement(l.a,{component:"main",maxWidth:"xs",className:"mt-5 pt-2 pb-2"},c.a.createElement(y.a,{className:a.backdrop,open:O},c.a.createElement(x.a,{color:"inherit"})),c.a.createElement(A.a,{in:!0,direction:"left"},c.a.createElement(m.a,{className:a.main},c.a.createElement(s.a,{className:a.alignCenter},c.a.createElement(p.a,{src:o.appIcon,className:a.avatar}),c.a.createElement(u.a,{className:"text-center"},c.a.createElement(u.a,{component:"span",className:"mr-1",color:"secondary"},o.appName),"wants Access to Your Account",c.a.createElement("br",null),c.a.createElement(u.a,{variant:"caption",className:"d-inline-flex"},c.a.createElement(p.a,{style:{width:"1rem",height:"1rem",marginRight:"0.5rem"},alt:T.username,src:T.account_image}),T.email)),c.a.createElement(u.a,{variant:"overline",component:"div",className:"text-left mt-3"},"This allows",c.a.createElement(u.a,{className:"ml-1",variant:"overline",color:"secondary"},o.appName)," To:"),c.a.createElement(b.a,{className:"".concat(a.root," mt-3")},o.appPerms.map(function(e,a){return c.a.createElement(c.a.Fragment,{key:a},c.a.createElement(E.a,{style:{minWidth:"100%"},button:!0,alignItems:"flex-start"},c.a.createElement(f.a,null,c.a.createElement(p.a,{alt:e.title,src:e.image,style:{width:"2rem",height:"2rem"},className:"bg-light",variant:"rounded"})),c.a.createElement(g.a,{primary:"".concat(e.desc),secondary:e.title})),c.a.createElement(N.a,{variant:"inset",component:"li"}))})),c.a.createElement("div",{className:"TrustComponent mt-3 px-2"},c.a.createElement(u.a,{variant:"button"},"Make sure you trust ",o.appName),c.a.createElement(u.a,{variant:"body2"},"You may be sharing sensitive info with this site or app. Learn about how ",o.appName," will handle your data by reviewing its terms of service and privacy policies. You can always see or remove access in your Kabeers Network Account."))),c.a.createElement(w.a,{className:"mb-5"},c.a.createElement(h.a,{onClick:function(){return window.location.href="".concat(decodeURIComponent(Object(k.e)("redirect_uri")),"?error=access_denied")},color:"secondary",className:"mx-2"},"Cancel"),c.a.createElement(h.a,{variant:"contained",color:"primary",className:"mx-2",onClick:function(){j(!O),Object(v.c)(T).catch(function(e){return j(!1)})}},"Allow"))))))};O.defaultProps={},a.default=Object(d.a)(O)}}]);
//# sourceMappingURL=26.feede677.chunk.js.map