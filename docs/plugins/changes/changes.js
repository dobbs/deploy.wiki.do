/* wiki-plugin-changes - 0.5.0 - Sat, 03 May 2025 10:43:53 GMT */
(()=>{var b=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),f=(t,l)=>`
    <li>
      <a class="internal" href="#" title="local" data-page-name="${t}" data-site="local">${b(l)}</a>
      <button class="delete">\u2715</button>
    </li>
  `,p=()=>{let t={};for(let l=0;l<localStorage.length;l++){let n=localStorage.key(l);t[n]=JSON.parse(localStorage.getItem(n))}return t},g=(t,l={})=>{let n=l.localStorage||window.localStorage,u=(o,c)=>{if(n.length==0){o.append("<ul><p><i>no local changes</i></p></ul>");return}let e=t("<ul />");o.append(e);for(let a=0;a<n.length;a++){let s=n.key(a),r=JSON.parse(n.getItem(s));r.title&&e.append(f(s,r.title))}n.length>0&&(c.submit?e.append('<button class="submit">Submit Changes</button>'):o.append(`
          <p> Click <i>Export Changes</i> to download changed pages as <i>${location.hostname}.json</i>.
          Drag-and-drop this file to import pages elsewhere.</p>
          <ul><button class="export">Export Changes</button></ul>
        `))};return{emit:u,bind:(o,c)=>{o.on("click",".delete",function(){let e=t(this).siblings("a.internal").data("pageName");n.removeItem(e),u(o.empty(),c)}),o.on("click",".submit",function(){t.ajax({type:"PUT",url:"/submit",data:{bundle:JSON.stringify(p(n))},success:(e,a,s)=>{if(wiki.log("ajax submit success",e,a,s),!e.type||!e.site)throw new Error("Incomplete Submission");let r=o.parents(".page:first"),i=t("<div />",{class:`item ${e.type}`}).data("item",e).attr("data-id",e.id);i.data("pageElement",r),r.find(".story").append(i),wiki.doPlugin(i,e);let d=i.prev(".item"),m=wiki.getItem(d);wiki.pageHandler.put(r,{item:e,id:e.id,type:"add",after:m?.id})},error:(e,a,s)=>{wiki.log("ajax error callback",a,s)}})}),o.on("click",".export",function(){let e=document.createElement("a");document.body.appendChild(e),e.setAttribute("href","data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(p(n)))),e.setAttribute("download",location.hostname+".json"),e.click(),document.body.removeChild(e)}),o.on("dblclick",function(){let e=p(n),a=Object.keys(e).length;wiki.dialog("JSON bundle for "+a+" pages",t("<pre/>").text(JSON.stringify(e,null,2)))})}}};wiki.registerPlugin("changes",g);var k=g;})();
//# sourceMappingURL=changes.js.map
