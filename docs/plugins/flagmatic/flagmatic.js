/* wiki-plugin-flagmatic - 0.3.0 - Sat, 03 May 2025 10:49:04 GMT */
(()=>{var s=t=>{let n=t.getContext("2d"),e=`hsl(${Math.round(Math.random()*360)}, 78%, 40%)`,o=`hsl(${Math.round(Math.random()*360)}, 78%, 55%)`,a=2*(Math.random()-.5),d=31*Math.cos(a),c=31*Math.sin(a),i=n.createLinearGradient(0,0,d,c);i.addColorStop(0,e),i.addColorStop(1,o),n.fillStyle=i,n.fillRect(0,0,n.canvas.width,n.canvas.height)},l=(t,n)=>{setTimeout(n,t)},g=(t,n)=>{t.append(`
    <div style="width:93%; background:#eee; padding:.8em; margin-bottom:5px; text-align: center;">
      <span class="flags"></span>
      <p class="caption">choose a new flag</p>
    </div>
    `);let e=t.find(".flags");for(let o=1;o<=(n.choices||40);o++){let a=$('<canvas width=32 height=32 style="padding: 3px;"/>');e.append(a),s(a.get(0))}},p=(t,n)=>{t.find("canvas").on("click",e=>{let o=e.target.toDataURL(),a=$.post("/favicon.png",{image:o});a.done(()=>{t.find(".caption").text("sweet")}),a.fail(()=>{t.find(".caption").text("ouch, logged in?")}),l(1500,()=>{t.find(".caption").text("choose another flag")})})};typeof window<"u"&&(window.plugins.flagmatic={emit:g,bind:p});var f=typeof window>"u"?{}:void 0;})();
//# sourceMappingURL=flagmatic.js.map
