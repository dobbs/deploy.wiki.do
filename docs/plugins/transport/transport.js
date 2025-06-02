/* wiki-plugin-transport - 0.3.0 - Sat, 03 May 2025 11:06:37 GMT */
(()=>{var p=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\*(.+?)\*/g,"<i>$1</i>");var g=t=>{let n=[],o=$(`.item:lt(${$(".item").index(t)})`);for(let e of o)$(e).hasClass("graph-source")&&n.push(e.graphData());return n},f=t=>{let n=0,o=0,e=0,a=$(`.item:lt(${$(".item").index(t)})`);for(let r of a)if($(r).hasClass("graph-source")){n+=1;for(let[i,s]of r.graphData())o+=1,e+=s.length}return{graphs:n,nodes:o,arcs:e}},u=t=>`<pre style="text-align: left; background-color:#ddd; padding:8px;"">${JSON.stringify(t,null,"  ")}</pre>`,c=t=>{let n=[],o=(n=t.match(/(https?:\/\/.*?\/)/))?n[1]:null,e=(n=t.match(/\bPOST\b\s*(.*)/))?n[1]:null,a=!!t.match(/\bGRAPH\b/);return{domain:o,post:e,graph:a}},h=(t,n)=>{let o=c(n.text);t.append(`
    <div style="background-color:#eee;padding:15px;text-align:center;">
      <div class="preview">
      </div>
      <p class="transport-action">
        transporting through<br>
        ${p(n.text)}
      </p>
      <p class="caption">
        unavailable
      </b>
    </div>
  `),o.domain&&$.get(o.domain,()=>{t.find(".caption").text("ready")}),o.graph&&(t.find(".preview").html(u(f(t))),t.find(".transport-action").append("<p><button>Beam Up</button></p>"))},w=(t,n)=>{let o=c(n.text);t.on("dblclick",()=>wiki.textEditor(t,n)),t.find("button").on("click",a=>{e(a,g(t))}),t.on("drop",a=>{a.preventDefault(),a.stopPropagation(),e(a,{text:a.originalEvent.dataTransfer.getData("text"),html:a.originalEvent.dataTransfer.getData("text/html"),url:a.originalEvent.dataTransfer.getData("URL")})});let e=(a,r)=>{t.find(".caption").text("waiting");let i=a.shiftKey?null:t.parents(".page"),s={type:"POST",url:o.post,dataType:"json",contentType:"application/json",data:JSON.stringify(r)};$.ajax(s).done(d=>{t.find(".caption").text("ready");let l=wiki.newPage(d);wiki.showResult(l,{$page:i})})}};typeof window<"u"&&(window.plugins.transport={emit:h,bind:w});var x=typeof window>"u"?{expand:p}:void 0;})();
//# sourceMappingURL=transport.js.map
