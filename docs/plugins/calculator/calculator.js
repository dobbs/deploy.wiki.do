/* wiki-plugin-calculator - 0.6.0 - Sat, 03 May 2025 10:42:17 GMT */
(()=>{window.plugins.calculator={emit:(n,t)=>{t.data=Object.keys(wiki.getData());let c=i(t).join(`
`),e=$('<pre style="font-size: 16px;"/>').text(c);n.append(e)},bind:(n,t)=>{n.on("dblclick",()=>wiki.textEditor(n,t))}};function i(n){let t=0;return n.text.split(`
`).map(function(c){let e=c.split(/\s+/);return e[0]=e[0].replace(/^[A-Z]+$/,function(a){return n.data[a]!=null&&a!=="SUM"||([n.data[a],t]=[t,0]),n.data[a].toFixed(2)}),e[0]=e[0].replace(/^-?[0-9.]+$/,function(a){switch(e[1]){case"CR":case"DB":t+=a/-1;break;case"*":t+=a*e[2];break;case"/":t+=a/e[2];break;default:t+=a/1}return(a/1).toFixed(2)}),c.match(/^\s*$/)&&(t=0),e.join(" ")})}})();
//# sourceMappingURL=calculator.js.map
