(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{102:function(e,a,t){"use strict";t.r(a);var o=t(41),n=t(30),r=t(0),i=t.n(r),c=(t(215),t(214)),l=t(217),d=t(220),s=t(106),p=t(218),m=t(219),b=t(105),u=t(122),h=t.n(u),g=t(104),f=t(163),y=t(212),x=t(57),v=t(216),S=t(285),w=t(169),k=t(210),C=t(83),E=t(165),z=t(43),O=t(16),N=h()(function(e){return{root:{width:"100%",maxWidth:"50ch",minWidth:"100%",backgroundColor:e.palette.background.paper},avatar:{margin:e.spacing(1),backgroundColor:e.palette.secondary.main},inline:{display:"inline"},main:{marginTop:e.spacing(8),display:"flex",flexDirection:"column",alignItems:"center"},alignCenter:{display:"flex",flexDirection:"column",alignItems:"center",minWidth:"100%",width:"100%"},backdrop:{zIndex:e.zIndex.drawer+1,color:"#fff"}}}),j=function(e){var a=null===localStorage.getItem("accounts")?null:JSON.parse(localStorage.getItem("accounts")),t=N(),r=document.getElementById("DataContainer"),u={appName:r.getAttribute("appName")};if(!r)return new Error("Main Element Not Defined");var h=i.a.useState(!1),j=Object(n.a)(h,2),I=j[0],R=j[1],V=function(a){R(!I),Object(x.a)(a).then(function(e){return e.json()}).then(function(t){"Nothing Found"!==t&&Object(z.a)(t).then(function(){r.setAttribute("choosenAccount",btoa(JSON.stringify(a))),e.callNext()})}).catch(function(e){})};return i.a.createElement(E.a,{in:!0},i.a.createElement("div",{className:"AccountChooser"},i.a.createElement(k.a,{className:t.backdrop,open:I},i.a.createElement(C.a,{color:"inherit"})),i.a.createElement(g.a,{component:"main",className:"mt-5 pt-2 pb-2",maxWidth:"xs"},i.a.createElement(f.a,null),i.a.createElement(v.a,{className:t.main},i.a.createElement(S.a,{className:t.alignCenter},i.a.createElement(s.a,{className:t.avatar},i.a.createElement(y.a,null)),i.a.createElement(b.a,{component:"h1",variant:"h5"},"Choose An Account"),i.a.createElement(b.a,{variant:"overline",className:"text-center"},"Continue to",i.a.createElement(b.a,{className:"ml-1",variant:"overline",color:"secondary"},u.appName)),i.a.createElement(c.a,{className:t.root},a.map(function(e,a){return i.a.createElement(i.a.Fragment,{key:a},i.a.createElement(l.a,{style:{minWidth:"100%"},button:!0,alignItems:"flex-start",onClick:function(){return V(Object(o.a)({},e,{password:atob(e.password)}))}},i.a.createElement(p.a,null,i.a.createElement(s.a,{alt:e.username,src:e.account_image})),i.a.createElement(m.a,{primary:e.username,secondary:e.email})),i.a.createElement(d.a,{variant:"inset",component:"li"}))}),i.a.createElement(l.a,{alignItems:"center",className:"text-center mt-2"},i.a.createElement(m.a,{primary:i.a.createElement(i.a.Fragment,null,i.a.createElement(w.a,{className:"w-100",onClick:function(){return window.location.href=Object(O.b)(window.location.href,"prompt","password")}},"Add New Account"))}))))))))};j.defaultProps={},a.default=j},112:function(e,a,t){"use strict";t.d(a,"a",function(){return c});var o=t(1),n=t(0),r=t.n(n),i=t(49);function c(e,a){var t=r.a.memo(r.a.forwardRef(function(a,t){return r.a.createElement(i.a,Object(o.a)({ref:t},a),e)}));return t.muiName=i.a.muiName,t}},169:function(e,a,t){"use strict";var o=t(2),n=t(1),r=t(0),i=(t(6),t(11)),c=t(15),l=t(24),d=t(308),s=t(13),p=r.forwardRef(function(e,a){var t=e.children,c=e.classes,l=e.className,p=e.color,m=void 0===p?"default":p,b=e.component,u=void 0===b?"button":b,h=e.disabled,g=void 0!==h&&h,f=e.disableElevation,y=void 0!==f&&f,x=e.disableFocusRipple,v=void 0!==x&&x,S=e.endIcon,w=e.focusVisibleClassName,k=e.fullWidth,C=void 0!==k&&k,E=e.size,z=void 0===E?"medium":E,O=e.startIcon,N=e.type,j=void 0===N?"button":N,I=e.variant,R=void 0===I?"text":I,V=Object(o.a)(e,["children","classes","className","color","component","disabled","disableElevation","disableFocusRipple","endIcon","focusVisibleClassName","fullWidth","size","startIcon","type","variant"]),$=O&&r.createElement("span",{className:Object(i.a)(c.startIcon,c["iconSize".concat(Object(s.a)(z))])},O),T=S&&r.createElement("span",{className:Object(i.a)(c.endIcon,c["iconSize".concat(Object(s.a)(z))])},S);return r.createElement(d.a,Object(n.a)({className:Object(i.a)(c.root,c[R],l,"inherit"===m?c.colorInherit:"default"!==m&&c["".concat(R).concat(Object(s.a)(m))],"medium"!==z&&[c["".concat(R,"Size").concat(Object(s.a)(z))],c["size".concat(Object(s.a)(z))]],y&&c.disableElevation,g&&c.disabled,C&&c.fullWidth),component:u,disabled:g,focusRipple:!v,focusVisibleClassName:Object(i.a)(c.focusVisible,w),ref:a,type:j},V),r.createElement("span",{className:c.label},$,t,T))});a.a=Object(c.a)(function(e){return{root:Object(n.a)({},e.typography.button,{boxSizing:"border-box",minWidth:64,padding:"6px 16px",borderRadius:e.shape.borderRadius,color:e.palette.text.primary,transition:e.transitions.create(["background-color","box-shadow","border"],{duration:e.transitions.duration.short}),"&:hover":{textDecoration:"none",backgroundColor:Object(l.b)(e.palette.text.primary,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"},"&$disabled":{backgroundColor:"transparent"}},"&$disabled":{color:e.palette.action.disabled}}),label:{width:"100%",display:"inherit",alignItems:"inherit",justifyContent:"inherit"},text:{padding:"6px 8px"},textPrimary:{color:e.palette.primary.main,"&:hover":{backgroundColor:Object(l.b)(e.palette.primary.main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},textSecondary:{color:e.palette.secondary.main,"&:hover":{backgroundColor:Object(l.b)(e.palette.secondary.main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},outlined:{padding:"5px 15px",border:"1px solid ".concat("light"===e.palette.type?"rgba(0, 0, 0, 0.23)":"rgba(255, 255, 255, 0.23)"),"&$disabled":{border:"1px solid ".concat(e.palette.action.disabledBackground)}},outlinedPrimary:{color:e.palette.primary.main,border:"1px solid ".concat(Object(l.b)(e.palette.primary.main,.5)),"&:hover":{border:"1px solid ".concat(e.palette.primary.main),backgroundColor:Object(l.b)(e.palette.primary.main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},outlinedSecondary:{color:e.palette.secondary.main,border:"1px solid ".concat(Object(l.b)(e.palette.secondary.main,.5)),"&:hover":{border:"1px solid ".concat(e.palette.secondary.main),backgroundColor:Object(l.b)(e.palette.secondary.main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}},"&$disabled":{border:"1px solid ".concat(e.palette.action.disabled)}},contained:{color:e.palette.getContrastText(e.palette.grey[300]),backgroundColor:e.palette.grey[300],boxShadow:e.shadows[2],"&:hover":{backgroundColor:e.palette.grey.A100,boxShadow:e.shadows[4],"@media (hover: none)":{boxShadow:e.shadows[2],backgroundColor:e.palette.grey[300]},"&$disabled":{backgroundColor:e.palette.action.disabledBackground}},"&$focusVisible":{boxShadow:e.shadows[6]},"&:active":{boxShadow:e.shadows[8]},"&$disabled":{color:e.palette.action.disabled,boxShadow:e.shadows[0],backgroundColor:e.palette.action.disabledBackground}},containedPrimary:{color:e.palette.primary.contrastText,backgroundColor:e.palette.primary.main,"&:hover":{backgroundColor:e.palette.primary.dark,"@media (hover: none)":{backgroundColor:e.palette.primary.main}}},containedSecondary:{color:e.palette.secondary.contrastText,backgroundColor:e.palette.secondary.main,"&:hover":{backgroundColor:e.palette.secondary.dark,"@media (hover: none)":{backgroundColor:e.palette.secondary.main}}},disableElevation:{boxShadow:"none","&:hover":{boxShadow:"none"},"&$focusVisible":{boxShadow:"none"},"&:active":{boxShadow:"none"},"&$disabled":{boxShadow:"none"}},focusVisible:{},disabled:{},colorInherit:{color:"inherit",borderColor:"currentColor"},textSizeSmall:{padding:"4px 5px",fontSize:e.typography.pxToRem(13)},textSizeLarge:{padding:"8px 11px",fontSize:e.typography.pxToRem(15)},outlinedSizeSmall:{padding:"3px 9px",fontSize:e.typography.pxToRem(13)},outlinedSizeLarge:{padding:"7px 21px",fontSize:e.typography.pxToRem(15)},containedSizeSmall:{padding:"4px 10px",fontSize:e.typography.pxToRem(13)},containedSizeLarge:{padding:"8px 22px",fontSize:e.typography.pxToRem(15)},sizeSmall:{},sizeLarge:{},fullWidth:{width:"100%"},startIcon:{display:"inherit",marginRight:8,marginLeft:-4,"&$iconSizeSmall":{marginLeft:-2}},endIcon:{display:"inherit",marginRight:-4,marginLeft:8,"&$iconSizeSmall":{marginRight:-2}},iconSizeSmall:{"& > *:first-child":{fontSize:18}},iconSizeMedium:{"& > *:first-child":{fontSize:20}},iconSizeLarge:{"& > *:first-child":{fontSize:22}}}},{name:"MuiButton"})(p)},212:function(e,a,t){"use strict";var o=t(0),n=t.n(o),r=t(112);a.a=Object(r.a)(n.a.createElement("path",{d:"M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"}),"LockOutlined")},215:function(e,a,t){}}]);
//# sourceMappingURL=14.b61f67e0.chunk.js.map