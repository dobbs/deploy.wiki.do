/* wiki-plugin-video - 0.4.0 - Sat, 03 May 2025 11:08:54 GMT */
(()=>{var a=(l="")=>{let r={},e=null,t;for(let s of l.split(/\r\n?|\n/))if(e=s.match(/^\s*START\s+([\w:.]+)\s*$/))r.start=e[1];else if(e=s.match(/^\s*END\s+([\w:.]+)\s*$/))r.end=e[1];else if(e=s.match(/^\s*([A-Z0-9]{3,})\s+([\w.\-/+0-9]+)\s*$/))r.player=e[1],r.options="",r.key=e[2];else if(e=s.match(/^\s*([A-Z0-9]{3,})\s+([A-Z,]+)\s+([\w.\-/+0-9]+)\s*$/))r.player=e[1],r.options=e[2],r.key=e[3];else if(e=s.match(/^\s*(HTML5)\s+([A-Za-z0-9]+)\s+(.+)\s*$/)){try{t=new URL(e[3])}catch(i){console.log(`failed to parse URL: ${i}`)}r.player=e[1],r.options=e[2],r.key=t.href}else r.caption||=" ",r.caption+=s+" ";return r},c=({player:l,options:r,key:e,start:t,end:s})=>{let i=[];switch(l){case"YOUTUBE":return r.toUpperCase()==="PLAYLIST"?`
          <iframe
            width="420" height="236"
            src="https://www.youtube-nocookie.com/embed/videoseries?list=${e}&rel=0"
            frameborder="0"
            allowfullscreen>
          </iframe>
        `:(i=[],t&&i.push(`start=${t.split(":").reduce((o,n)=>o*60+Number(n))}`),s&&i.push(`end=${s.split(":").reduce((o,n)=>o*60+Number(n))}`),i.push("rel=0"),`
          <iframe
            width="420" height="236"
            src="https://www.youtube-nocookie.com/embed/${e}?${i.join("&")}"
            frameborder="0"
            allowfullscreen>
          </iframe>
        `);case"VIMEO":return i=[],i.push("byline=0"),i.push("dnt=1"),i.push("portrait=0"),i.push("title=0"),t&&i.push(`#t=${t}`),`
        <iframe
          src="https://player.vimeo.com/video/${e}?${i.join("&")}"
          width="420" height="236"
          frameborder="0"
          allowfullscreen>
        </iframe>
      `;case"ARCHIVE":return`
        <iframe
          src="https://archive.org/embed/${e}"
          width="420" height="315"
          frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true"
          allowfullscreen>
        </iframe>
      `;case"TED":return`
        <iframe
          src="https://embed-ssl.ted.com/talks/${e}.html"
          width="420" height="300"
          frameborder="0" scrolling="no" webkitAllowFullScreen mozallowfullscreen
          allowFullScreen>
        </iframe>
      `;case"HTML5":if(!e.includes("#t=")&&t||s){let o="#t=";t&&(o+=t),s&&(o+=`,${s}`),e=e+o}return`
        <video controls preload="metadata" width="100%">
          <source src="${e}"
                  type="video/${r}">
        </video>
      `;case"TEDX":return`
        <i>TEDx talks are now available in the TEDx YouTube channel. See ${wiki.resolveLinks("[[Updating TEDx items]]")} for help.</i><br>
      `;case"CHANNEL9":return`
        <i>The Channel 9 site closed, see ${wiki.resolveLinks("[[Updating CHANNEL9 items]]")} for help.</i><br>
      `;default:return"(unknown player)"}},u=(l,r)=>{let e=a(r.text);l.append(`
    ${c(e)}
    <br>
    <i>${wiki.resolveLinks(e.caption||"(no caption)")}</i>
  `)},f=(l,r)=>{l.on("dblclick",()=>wiki.textEditor(l,r))};typeof window<"u"&&(window.plugins.video={emit:u,bind:f});var d=typeof window>"u"?{parse:a,embed:c}:void 0;})();
//# sourceMappingURL=video.js.map
