(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-myWallet-function-function"],{"68a1":function(t,n,e){"use strict";e.r(n);var c=e("d1a6"),a=e("8fb6");for(var i in a)"default"!==i&&function(t){e.d(n,t,(function(){return a[t]}))}(i);var u,o=e("f0c5"),l=Object(o["a"])(a["default"],c["b"],c["c"],!1,null,"73e0ec48",null,!1,c["a"],u);n["default"]=l.exports},"7b00":function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var c={data:function(){return{list:[{iconPath:"home",selectedIconPath:"home-fill",text:"首页",count:0,customIcon:!1,pagePath:"/pages/myWallet/myWallet"},{iconPath:"file-text",selectedIconPath:"file-text-fill",text:"发票",count:0,customIcon:!1,pagePath:"/pages/myWallet/bill/bill"},{iconPath:"setting",selectedIconPath:"setting-fill",text:"应用",count:0,customIcon:!1,pagePath:"/pages/myWallet/function/function"}]}},methods:{change:function(t){this.current=t,uni.navigateTo({url:this.list[t].pagePath,success:function(t){},fail:function(){},complete:function(){}})},onBackPress:function(t){return"backbutton"==t.from&&uni.redirectTo({url:"../../index/index"}),!0}}};n.default=c},"8fb6":function(t,n,e){"use strict";e.r(n);var c=e("7b00"),a=e.n(c);for(var i in c)"default"!==i&&function(t){e.d(n,t,(function(){return c[t]}))}(i);n["default"]=a.a},d1a6:function(t,n,e){"use strict";e.d(n,"b",(function(){return a})),e.d(n,"c",(function(){return i})),e.d(n,"a",(function(){return c}));var c={uTabbar:e("e8e4").default},a=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("v-uni-view",[e("u-tabbar",{attrs:{activeColor:"#06A7E2","inactive-color":"#000000",list:t.list,"icon-size":"40"},on:{change:function(n){arguments[0]=n=t.$handleEvent(n),t.change.apply(void 0,arguments)}},model:{value:t.current,callback:function(n){t.current=n},expression:"current"}})],1)},i=[]}}]);