/* wiki-plugin-recycler - 0.4.0 - Sat, 03 May 2025 11:03:27 GMT */
(()=>{var a=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),p=(t,l)=>`
    <li>
      <a class="internal" href="#" title="recycler" data-page-name="${t}" data-site="recycler">${a(l)}</a>
      <button class="delete">\u2715</button>
    </li>
  `,d=(t,l)=>{wiki.recycler.get("system/slugs.json",(r,e)=>{if(r)t.append(`
        <p style="background-color:#eee;padding:15px;">
          Unable to fetch contents of recycler
        </p>
      `);else if(e.length===0)t.append(`
        <p style="background-color:#eee;padding:15px;">
          The recycler is empty
        </p>
      `);else{let c=$("<ul>");t.append(c);for(let n=0;n<e.length;n++){let o=e[n].slug,i=e[n].title?e[n].title:e[n].slug;c.append(p(o,i))}e.length>0&&t.append(`
          <ul><button class="empty">Empty Recyler</button></ul>
        `)}})},s=(t,l)=>fetch(t,{method:"DELETE",cache:"no-cache",mode:"same-origin",credentials:"include"}).then(e=>{if(e.ok){let c=$(l).parent().parent();$(l).parent().remove(),c.children().length===0&&(c.empty(),c.append(`
            <p style="background-color:#eee;padding:15px;">
              The recycler is empty
            </p>
            `))}return e}).catch(e=>{throw console.log("recycler error: ",e),e}),g=(t,l)=>{t.on("click",".delete",function(){let r="/recycler/"+$(this).siblings("a.internal").data("pageName")+".json";s(r,this).catch(e=>console.log("recycler error: ",e))}),t.on("click",".empty",function(){let r=$(this).parent().parent().children().first(),e=Array.from($(r).children()).map(c=>{let n="/recycler/"+$(c).children("a.internal").data("pageName")+".json",o=$(c).children(".delete");return s(n,o)});Promise.allSettled(e).catch(c=>console.log("recycler error: ",c))})};window&&(window.plugins.recycler={emit:d,bind:g});})();
//# sourceMappingURL=recycler.js.map
