/**
 * Beast
 * @version 0.10.0
 * @homepage github.yandex-team.ru/kovchiy/beast
 */
"undefined"!=typeof window?(window.Beast={},document.addEventListener("DOMContentLoaded",function(){Beast.init()})):global.Beast={},function(){Beast._decl={},Beast._declFinished=!1,Beast._httpRequestQueue=[],Beast._cssLinksToLoad=0,Beast._isReady=!1,Beast._onReadyCallbacks=[],Beast._bemNodes=[],Beast._reservedDeclProperies={inherits:1,expand:1,mod:1,param:1,domInit:1,domAttr:1,mix:1,on:1,onWin:1,onMod:1,onRemove:1,tag:1,noElems:1,inheritedDecls:1,userMethods:1,commonExpand:1,commonDomInit:1},Beast.decl=function(e,t){if("object"==typeof e){for(key in e)Beast.decl(key,e[key]);return this}if(t.inherits&&"string"==typeof t.inherits&&(t.inherits=[t.inherits]),t.mix&&"string"==typeof t.mix&&(t.mix=[t.mix]),"undefined"!=typeof Beast._decl[e]){var n=Beast._decl[e];for(item in n)"undefined"==typeof t[item]&&(t[item]=n[item])}return Beast._decl[e]=t,this},Beast._compileDeclarations=function(){function e(t,n){for(var i in n)"undefined"==typeof t[i]?t[i]=n[i]:"object"==typeof n[i]&&e(t[i],n[i])}function t(e,t,n){0!==t.length&&(n[e]=function(){for(var e=0,n=t.length;n>e;e++)t[e].call(this)})}for(var n in Beast._decl)(function(n){if(n.inherits)for(var i=n.inherits.length-1;i>=0;i--){var s=Beast._decl[n.inherits[i]];s&&(e(n,s),n.inheritedDecls||(n.inheritedDecls=[]),n.inheritedDecls.push(s))}var o=[];n.expand&&o.unshift(n.expand),n.param&&o.unshift(function(){this.defineParam(n.param)}),n.mix&&o.unshift(function(){this.mix.apply(this,n.mix)}),n.inherits&&o.unshift(function(){this.mix.apply(this,n.inherits)}),n.mod&&o.unshift(function(){this.defineMod(n.mod)}),n.tag&&o.unshift(function(){this.tag(n.tag)}),n.noElems&&o.unshift(function(){this.noElems(n.noElems)}),n.domAttr&&o.unshift(function(){this.domAttr(n.domAttr)}),n.onMod&&o.unshift(function(){for(modName in n.onMod)for(modValue in n.onMod[modName])this.onMod(modName,modValue,n.onMod[modName][modValue])});var r=[];n.domInit&&r.unshift(n.domInit),n.on&&r.unshift(function(){for(events in n.on)this.on(events,n.on[events])}),n.onWin&&r.unshift(function(){for(events in n.onWin)this.onWin(events,n.onWin[events])}),t("commonExpand",o,n),t("commonDomInit",r,n),n.userMethods={};for(var d in n)1!==Beast._reservedDeclProperies[d]&&(n.userMethods[d]=n[d])})(Beast._decl[n])},Beast.node=function(e,t){return Beast._declFinished||(Beast._declFinished=!0,Beast._compileDeclarations()),new Beast.BemNode(e,t,Array.prototype.splice.call(arguments,2))},Beast.findNodes=function(){for(var e=[],t=0,n=arguments.length;n>t;t++)for(var i=arguments[t],s=0,o=Beast._bemNodes.length;o>s;s++){var r=Beast._bemNodes[s];r&&r._domClasses.indexOf(i)>=0&&e.push(r)}return e},Beast.findNodeById=function(e){for(var t=0,n=Beast._bemNodes.length;n>t;t++){var i=Beast._bemNodes[t];if(i&&i._id===e)return i}},Beast._checkIfReady=function(){if(!Beast._isReady){for(var e=!0,t=0,n=Beast._httpRequestQueue.length;n>t;t++){var i=Beast._httpRequestQueue[t];(4!==i.readyState||200!==i.status)&&(e=!1)}if(document.styleSheets.length<Beast._cssLinksToLoad&&(e=!1),e){for(var t=0,n=Beast._httpRequestQueue.length;n>t;t++)Beast.evalBml(Beast._httpRequestQueue[t].responseText);Beast._httpRequestQueue=[],Beast._processBmlScripts(),Beast._isReady=!0;for(var t=0,n=Beast._onReadyCallbacks.length;n>t;t++)Beast._onReadyCallbacks[t]()}}},Beast.onReady=function(e){Beast._isReady?e():this._onReadyCallbacks.push(e)},Beast._require=function(e){var t=new XMLHttpRequest;t.open("GET",e),t.onreadystatechange=function(){4===this.readyState&&200===this.status&&Beast._checkIfReady()},Beast._httpRequestQueue.push(t),t.send()},Beast.evalBml=function(text){var parsedText=Beast.parseBML(text);/^[\s\n]*</.test(text)&&(parsedText+=document.body?".render(document.body)":".render(document.documentElement)"),eval(parsedText)},Beast._processBmlScripts=function(){for(var e=document.getElementsByTagName("script"),t=0,n=e.length;n>t;t++){var i=e[t],s=i.text;"bml"===i.type&&""!==s&&Beast.evalBml(s)}},Beast.init=function(){for(var e=document.getElementsByTagName("link"),t=[],n=0,i=e.length;i>n;n++){var s=e[n];("bml"===s.type||"bml"===s.rel)&&(Beast._require(s.href),t.push(s)),"stylesheet"===s.rel&&(Beast._cssLinksToLoad++,s.onload=s.onerror=function(){Beast._checkIfReady()})}for(var n=0,i=t.length;i>n;n++)t[n].parentNode.removeChild(t[n]);Beast._checkIfReady()}}(),function(){function e(e){for(var t,n="",i=0,s="",o=0,r=e.length;r>o;o++)t=e[o],"{"===t&&"\\"!==s?(i++,1===i?""!==n&&(n+="',"):n+=t):i>0&&"}"===t?(i--,0===i?r-1>o&&"{"!==e[o+1]&&(n+=",'"):n+=t):0===i?(0===o&&(n+="'"),"'"===t&&(n+="\\"),n+=t,o===r-1&&(n+="'")):n+=t,s=t;return n}function t(e,t,i){e=e.substr(1),e=e.substr(0,e.length-(t?2:1));var s=n(e);return i&&(s.attr+=(""===s.attr?"":",")+"'context':this"),""===s.attr&&"null"===s.attr,"Beast.node('"+s.name+"',{"+s.attr+"}"+(t?")":"")}function n(t){for(var n,i,s="",o="",r="",d=!1,h=0,a=t.length-1;a>=h;h++){var l=t[h];h===a&&" "!==l&&"\n"!==l&&"'"!==l&&'"'!==l&&"="!==l&&(o+=l)," "!==l&&"\n"!==l&&h!==a||"undefined"!=typeof n?" "!==l&&"\n"!==l&&h!==a||""===o||""!==r?"="===l&&""===r?(i=o,o=""):'"'!==l&&"'"!==l||""!==r?l!==r||d?" "!==l&&"\n"!==l||""===r?" "!==l&&"\n"!==l&&(o+=l):o+=l:(s+="'"+i+"':"+(""===o?"false":e(o))+",",r="",o=""):r=l:(s+="'"+o+"':true,",o=""):(n=o,o=""),d="\\"===l}return""!==s&&(s=s.substring(0,s.length-1)),{name:n,attr:s}}function i(n){var i;for(n=n.replace(r,"");;){if(i=o.exec(n),null===i)return n;var d,h=i[0],a=i.index;if("/"===h[h.length-2])d=h.length;else{var l=h.indexOf("\n");0>l&&(l=h.indexOf(" ")),0>l&&(l=h.length-1);var _,c,m=h.substr(1,l-1),f=new RegExp("<"+m+"(?:|[ \n][^>]*)>","g"),u="</"+m+">",p=n.substr(a+1),y=-1,N=0,B=0;do d=0===B?p.search(u):c.search(u)+B,_=p.substr(0,d),c=p.substr(d+1),N=_.match(f),N=null!==N?N.length:0,y++,B=d+1;while(N>y);d+=1+u.length}for(var v,p=n.substr(a,d),g="",k="",x=[],C=0,b=p.length;b>C;C++)v=p[C],"\n"!==v&&("<"===v&&(x.push(k),k=""),k+=v,">"===v&&(x.push(k),k=""));""!==k&&x.push(p);for(var E,D=!0,C=0,b=x.length;b>C;C++){var v=x[C];if(!s(v)){var I=v.substr(0,1),M=v.substr(0,2),P=v.substr(v.length-1),R=v.substr(v.length-2);if("</"!==M||">"!==P)if(D?(D=!1,E=!0):(g+=", ",E=!1),"<"!==I||"/>"!==R)if("<"!==I||">"!==P){if("<"===I)return console.error("Unclosed node:",v);g+=e(v)}else g+=t(v,!1,E);else g+=t(v,!0,E);else g+=")"}}n=n.substr(0,a)+g+n.substr(a+d)}}function s(e){for(var t=0,n=e.length;n>t;t++)if(" "!==e[t])return!1;return!0}var o=/<[a-z][^>]+\/?>/i,r=/<!--[^]*-->/g;Beast.parseBML=i}(),function(){function e(e,t,n){this._name="",this._nodeName=e,this._attr=t||{},this._isBlock=!1,this._isElem=!1,this._mod={},this._modHandlers={},this._param={},this._domNode=null,this._domAttr={},this._domClasses=null,this._afterDomInitHandlers=[],this._domInited=!1,this._parentBlock=null,this._forcedParentBlock=!1,this._parentNode=null,this._prevParentNode=null,this._children=[],this._expandedChildren=null,this._isExpanded=!1,this._isExpandContext=!1,this._isReplaceContext=!1,this._mix=[],this._tag="div",this._id="",this._noElems=!1,this._implementedNode=null,this._bemNodeIndex=-1,this._css={},this._decl=null;var i=e.substr(0,1);this._isBlock=i===i.toUpperCase(),this._isElem=!this._isBlock,this._isBlock&&(this._name=e.toLowerCase(),this._decl=Beast._decl[this._name],this._parentBlock=this,this._defineUserMethods());for(key in this._attr){var i=key.substr(0,1);i===i.toUpperCase()?this._mod[key.toLowerCase()]=this._attr[key]:"mix"===key?this._mix=this._attr.mix.split(" "):"context"!==key||this._parentBlock?"block"===key?(this.parentBlock(this._attr.block,!0),this._forcedParentBlock=!0):"tag"===key?this._tag=this._attr.tag:"id"===key?this._id=this._attr.id:this._param[key]=this._attr[key]:this.parentBlock(this._attr.context)}this.append.apply(this,n)}e.prototype={inherited:function(){if(!this._decl||!this._decl.inheritedDecls)return this;var e=arguments.callee.caller;if("undefined"!=typeof e._inherited)return e._inherited!==!1&&e._inherited.call(this),this;var t=this._findCallerPath(e,this._decl);if("undefined"==typeof t)return this;for(var n=this._decl.inheritedDecls.length-1;n>=0;n--){for(var i=this._decl.inheritedDecls[n],s=0,o=t.length;o>s&&(i=i[t[s]]);s++);if(i){arguments.callee.caller._inherited=i,i.call(this);break}arguments.callee.caller._inherited=!1}return this},isBlock:function(){return this._isBlock},isElem:function(){return this._isElem},selector:function(){return this._name},id:function(e){return"undefined"==typeof e?this._id:(this._id=e,this._domNode&&(this._domNode.id=e),this)},tag:function(e){return"undefined"==typeof e?this._tag:(this._domNode||(this._tag=e),this)},css:function(e,n){if("object"==typeof e)for(key in e)this.css(key,e[key]);else{if("undefined"==typeof n)return this._domNode?window.getComputedStyle(this._domNode).getPropertyValue(e):this._css[e];"number"==typeof n&&t[e]&&(n+="px"),this._css[e]=n,this._domNode&&this._setDomNodeCSS()}return this},noElems:function(e){return this._noElems=e,this._setParentBlockForChildren(this,this._parentBlock._parentNode),this},parentBlock:function(t,n){if(t){if(this._isElem&&t instanceof e&&t!==this._parentBlock&&!this._forcedParentBlock){if(t._parentBlock&&t._parentBlock._noElems)return this.parentBlock(t._parentNode,n);this._clearUserMethods(),this._parentBlock=t._parentBlock,this._name=this._parentBlock._name+"__"+this._nodeName,this._decl=Beast._decl[this._name],this._defineUserMethods(),n||this._setParentBlockForChildren(this,t)}return this}return this._implementedNode?this._implementedNode._parentBlock:this._parentBlock},parentNode:function(t){return"undefined"!=typeof t?(t instanceof e&&(this._prevParentNode=this._parentNode,this._parentNode=t),this):this._parentNode},domNode:function(){return this._domNode},domAttr:function(e,t,n){if("object"==typeof e)for(key in e)this.domAttr(key,e[key]);else{if("undefined"==typeof t)return this._domAttr[e];n||(this._domAttr[e]=t),this._domNode&&(t===!1||""===t?this._domNode.removeAttribute(e):this._domNode.setAttribute(e,t))}return this},mix:function(){for(var e=0,t=arguments.length;t>e;e++)this._mix.push(arguments[e]);return this._domNode&&this._setDomNodeClasses(),this},defineMod:function(e){return this._implementedNode&&this._implementedNode._extendProperty("_mod",e),this._extendProperty("_mod",e)},defineParam:function(e){return this._extendProperty("_param",e)},mod:function(e,t,n){if("object"==typeof e)for(key in e)this.mod(key,e[key]);else{if("undefined"==typeof t)return this._mod[e];this._mod[e]!==t&&(this._mod[e]=t,this._implementedNode&&(this._implementedNode._mod[e]=t),this._domNode&&(this._setDomNodeClasses(),this._callModHandlers(e,t,n)))}return this},param:function(e,t){if("object"==typeof e)for(key in e)this.param(key,e[key]);else{if("undefined"==typeof t)return this._param[e];this._param[e]=t}return this},on:function(e,t){for(var n=e.split(" "),i=0,s=n.length;s>i;i++)!function(e,n){e._domNode.addEventListener(n,function(n){t.call(e,n,n.detail)})}(this,n[i]);return this},onWin:function(e,t){for(var n=e.split(" "),i=0,s=n.length;s>i;i++)!function(e,n){window.addEventListener(n,function(n){t.call(e,n,n.detail)})}(this,n[i]);return this},onMod:function(e,t,n){return"undefined"==typeof this._modHandlers[e]&&(this._modHandlers[e]={}),"undefined"==typeof this._modHandlers[e][t]&&(this._modHandlers[e][t]=[]),this._modHandlers[e][t].push(n),this},trigger:function(e,t){return this._domNode&&this._domNode.dispatchEvent(t?new CustomEvent(e,{detail:t}):new Event(e)),this},triggerWin:function(e,t){return this._domNode&&(e=this.parentBlock()._name+":"+e,window.dispatchEvent(t?new CustomEvent(e,{detail:t}):new Event(e))),this},index:function(){for(var e=this._parentNode._children,t=0,n=0,i=e.length;i>n;n++)if("string"==typeof e[n]&&t++,e[n]===this)return n-t},empty:function(){var t;if(this._isExpandContext?(t=this._expandedChildren,this._expandedChildren=[]):(t=this._children,this._children=[]),t)for(var n=0,i=t.length;i>n;n++)t[n]instanceof e&&t[n]._unlink();if(this._domNode)for(;this._domNode.firstChild;)this._domNode.removeChild(this._domNode.firstChild);return this},remove:function(e){return this._domNode&&this._domNode.parentNode.removeChild(this._domNode),this._parentNode&&(this._parentNode._children=this._parentNode._children.splice(this.index(),1)),e||this._unlink(),this},append:function(){for(var t=0,n=arguments.length;n>t;t++){var i=arguments[t];i!==!1&&null!==i&&"undefined"!=typeof i&&(Array.isArray(i)?this.append.apply(this,i):(i instanceof e?(i.parentNode(this),i._isElem&&(this._isBlock?i.parentBlock(this):this._attr.context&&i.parentBlock(this._parentBlock))):"number"==typeof i&&(i=i.toString()),this._domNode&&!this._isReplaceContext?(this._children.push(i),this._renderChildWithIndex(this._children.length-1)):this._isExpandContext?(this._expandedChildren||(this._expandedChildren=[]),this._expandedChildren.push(i)):this._children.push(i)))}return this},appendTo:function(e){return this.remove(!0),e.append(this),this},replaceWith:function(t){this._completeExpand();var n,i=this._parentNode;i&&(i===t?i=this._prevParentNode:(n=i._children.splice(this.index()),n.shift()),i._isReplaceContext=!0,i.append(t),i._isReplaceContext=!1),n&&(i._children=i._children.concat(n)),this._parentNode=null,t instanceof e&&(t._isBlock&&t._resetParentBlockForChildren(),t.render())},implementWith:function(e){this._setDomNodeClasses(),e._implementedNode=this,e._extendProperty("_mod",this._mod),e._extendProperty("_param",this._param),this._extendProperty("_mod",e._mod),e._defineUserMethods(this._name),this.replaceWith(e)},text:function(){for(var e="",t=0,n=this._children.length;n>t;t++)"string"==typeof this._children[t]&&(e+=this._children[t]);return e},get:function(){if(0===arguments.length)return this._children;for(var e=[],t=0,n=arguments.length;n>t;t++){for(var i,s=arguments[t].split("/"),o=0,r=s.length;r>o;o++){var d=s[o];if(0===o)i=this._filterChildNodes(d);else{var h=i;i=[];for(var a=0,l=h.length;l>a;a++)i=i.concat(this._filterChildNodes.call(h[a],d))}if(0===i.length)break}e=1===n?i:e.concat(i)}return e},getWithContext:function(){for(var t=this.get.apply(this,arguments),n=0,i=t.length;i>n;n++)t[n]instanceof e&&(t[n]._forcedParentBlock=!0);return t},has:function(){return this.get.apply(this,arguments).length>0},afterDomInit:function(e){return this._domInited?e.call(this):this._afterDomInitHandlers.push(e),this},clone:function(){var t={};t.__proto__=this.__proto__;for(key in this)if("_children"===key){for(var n=[],i=0,s=this._children.length;s>i;i++)n.push(this._children[i]instanceof e?this._children[i].clone():this._children[i]);t._children=n}else t[key]=this[key];return t},render:function(e){if(this._expand(),!e&&!this._parentNode)return this;if(!this._domNode){this._domNode=document.createElement(this._tag),this._domNode.bemNode=this,""!==this._id&&(this._domNode.id=this._id),this._setDomNodeClasses(),this._setDomNodeCSS();for(key in this._domAttr)this.domAttr(key,this._domAttr[key],!0)}e?e.appendChild(this._domNode):this._parentNode._domNode.appendChild(this._domNode);for(var t=0,n=this._children.length;n>t;t++)this._renderChildWithIndex(t);this._bemNodeIndex=Beast._bemNodes.length,Beast._bemNodes.push(this),"body"===this._tag&&document.documentElement.replaceChild(this._domNode,document.body);for(modName in this._mod)this._callModHandlers(modName,this._mod[modName]);return this._domInit(),this},renderHTML:function(){var e="";return e},_setParentBlockForChildren:function(t,n){for(var i=0,s=t._children.length;s>i;i++){var o=t._children[i];o instanceof e&&o._isElem&&o.parentBlock(n)}},_filterChildNodes:function(t){if(".."===t)return[this._parentNode];for(var n=[],i=0,s=this._children.length;s>i;i++){var o=this._children[i];o instanceof e&&(""===t||t===o._nodeName||o._implementedNode&&t===o._implementedNode._nodeName)&&n.push(o)}return n},_renderChildWithIndex:function(t){var n=this._children[t];n instanceof e?n.render():this._domNode.appendChild(document.createTextNode(n))},_expand:function(){if(!this._isExpanded){var e=this._decl;e&&(this._isExpandContext=!0,e.commonExpand&&e.commonExpand.call(this),this._completeExpand(),this._isExpandContext=!1)}},_completeExpand:function(){this._isExpandContext&&this._expandedChildren&&(this._children=this._expandedChildren,this._expandedChildren=null),this._isExpanded=!0},_domInit:function(){var e=this._decl;if(e&&e.commonDomInit&&e.commonDomInit.call(this),this._implementedNode&&(e=this._implementedNode._decl)&&e.commonDomInit&&e.commonDomInit.call(this),this._domInited=!0,0!==this._afterDomInitHandlers.length)for(var t=0,n=this._afterDomInitHandlers.length;n>t;t++)this._afterDomInitHandlers[t].call(this)},_callModHandlers:function(e,t,n,i){var s;if(this._modHandlers[e]&&(this._modHandlers[e][t]?s=this._modHandlers[e][t]:t===!1&&this._modHandlers[e][""]?s=this._modHandlers[e][""]:""===t&&this._modHandlers[e][!1]&&(s=this._modHandlers[e][!1]),this._modHandlers[e]["*"]&&(s=s?s.concat(this._modHandlers[e]["*"]):this._modHandlers[e]["*"])),s){"undefined"==typeof i&&(i=this);for(var o=0,r=s.length;r>o;o++)s[o].call(i,n)}this._implementedNode&&this._implementedNode._callModHandlers(e,t,n,this)},_extendProperty:function(e,t){var n=this[e];for(key in t)"undefined"!=typeof n[key]&&""!==n[key]?this[e][key]=n[key]:this[e][key]=t[key];return this},_setDomNodeClasses:function(e){var t,n,i=this._name;for(key in this._mod)if(t=this._mod[key],""!==t&&t!==!1){n=t===!0?"_"+key:"_"+key+"_"+t,i+=" "+this._name+n;for(var s=0,o=this._mix.length;o>s;s++)i+=" "+this._mix[s]+n}this._implementedNode&&(i+=" "+this._implementedNode._setDomNodeClasses(!0));for(var s=0,o=this._mix.length;o>s;s++)i+=" "+this._mix[s];return e?i:(this._domClasses=i.split(" "),void(this._domNode&&(this._domNode.className=i)))},_setDomNodeCSS:function(){var e="";for(name in this._css)(this._css[name]||0===this._css[name])&&(e+=name+":"+this._css[name]+";");""!==e&&this._domNode.setAttribute("style",e)},_resetParentBlockForChildren:function(){for(var t=0,n=this._children.length;n>t;t++){var i=this._children[t];i instanceof e&&i._isElem&&(i.parentBlock(this._parentBlock),i._resetParentBlockForChildren(this._parentBlock))}},_defineUserMethods:function(e){var t=e?Beast._decl[e]:this._decl;if(t)for(methodName in t.userMethods)this[methodName]=t.userMethods[methodName]},_clearUserMethods:function(){if(""!==this._name&&Beast._decl[this._name]){var e=Beast._decl[this._name].userMethods;for(methodName in e)this[methodName]=null}},_unlink:function(){var e=this._decl;e&&e.onRemove.call(this),this._bemNodeIndex>=0&&(Beast._bemNodes[this._bemNodeIndex]=null)},_findCallerPath:function(e,t,n){"undefined"==typeof n&&(n=[]);for(var i in t)if("object"==typeof t[i]){var s=this._findCallerPath(e,t[i],n.concat(i));if("undefined"!=typeof s)return n.concat(s)}else if("function"==typeof t[i]&&t[i]===e)return n.concat(i)}},Beast.BemNode=e;var t={height:1,width:1,left:1,right:1,bottom:1,top:1,"line-height":1,"font-size":1}}();