/* wiki-plugin-rollup - 0.4.0 - Sat, 03 May 2025 11:05:04 GMT */
(()=>{window.plugins.rollup={emit:(s,u)=>{},bind:(s,u)=>{s.on("dblclick",()=>wiki.textEditor(s,u)),s.append(`
      <style>
        td.material {overflow:hidden;}
        td.score {text-align:right; width:25px}
      </style>
    `);let i=t=>{if(t==null)return NaN;switch(t.constructor){case Number:return t;case String:return+t;case Array:return i(t[0]);case Object:return i(t.value);case Function:return t();default:return NaN}},p=(t=>{wiki.log("attach",wiki.getDataNodes(s));for(let o of wiki.getDataNodes(s)){wiki.log("attach loop",$(o).data("item").text);let e=$(o).data("item");if(e.text.indexOf(t)>=0)return e}throw new Error(`can't find dataset with caption ${t}`)})("Materials Summary"),d=(t,o)=>{let e=o.row,r=o.$row;for(let n of p.columns)if(n=="Material"){let a=wiki.resolveLinks(`[[${e.Material}]]`);if(t)if(o.errors.length>0){let l=o.errors.map(c=>c.message.replace(/"/g,"'")).join(`
`);r.append(`<td class="material">${a} <span style="color:red;" title="${l}">\u2718</span></td>`)}else r.append(`<td class="material">${a}</td>`);else r.append(`<td class="material">${a}</td>`)}else{let a=i(e[n]),l=i(o.input[n]);if(t&&l!=null){let c=a.toFixed(4)==l.toFixed(4)?"green":a.toFixed(0)==l.toFixed(0)?"orange":"red",S=`${e.Material}
${n}
old ${a.toFixed(4)}
now ${l.toFixed(4)}`;r.append(`<td class="score" title="${S}" data-thumb="${n}" style="color:${c};">${a.toFixed(0)}</td>`)}else{let c=`${e.Material}
${n}
${a.toFixed(4)}`;r.append(`<td class="score" title="${c}" data-thumb="${n}">${a.toFixed(0)}</td>`)}}},m=(t,o,e)=>{if(t.methods.length>0)o.eval(t,t.methods.shift(),t.input,(r,n)=>{r.output=n,Object.assign(r.input,n),m(r,o,e)});else return e(t)},k=(t,o)=>{setTimeout(o,t)},y=(t,o,e)=>{k(t,()=>{wiki.getPlugin("method",r=>{$.getJSON(`/${o.slug}.json`,n=>{o.methods=n.story.filter(a=>a.type=="method"),m(o,r,e)})})})},F=(t={})=>{let o=$(`.item:lt(${$(".item").index(s)})`),e=Object.assign({},t);for(let r of o)r=$(r),r.hasClass("radar-source")?Object.assign(e,r.get(0).radarData()):r.hasClass("data")&&Object.assign(e,r.data("item").data[0]);return e},N=t=>{wiki.log("reindex",t),t.sort((e,r)=>i(r.input["Total Score"])-i(e.input["Total Score"])).forEach((e,r)=>{e.input.Rank=`${r+1}`}),t.forEach(e=>{e.$row.empty(),d(!0,e)})},f=$("<table/>");s.append(f);let w=p.data.sort((t,o)=>-i(o["Total Score"])- -i(t["Total Score"])),g=0,h=[],x=w.length;for(let t of w){let o=wiki.asSlug(t.Material),e=$(`<tr class="${o}">`);f.append(e);let r={$row:e,row:t,slug:o,input:F(),errors:[]};d(!1,r),g+=200,y(g,r,n=>{n.$row.empty(),n.input.Rank=n.row.Rank,d(!0,n),h.push(n),x-=1,x||N(h)})}}};})();
//# sourceMappingURL=rollup.js.map
