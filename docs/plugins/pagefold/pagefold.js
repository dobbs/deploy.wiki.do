/* wiki-plugin-pagefold - 0.4.0 - Sat, 03 May 2025 10:57:18 GMT */
(()=>{var e=(i,t)=>{i.append(`
		<div style="height: 10px; border-top: 2px solid lightgray; margin-top: 24px; text-align: center; position: relative; clear: both;">
			<span style="position: relative; top: -.8em; background: white; display: inline-block; color: gray; ">
				&nbsp; ${t.text} &nbsp;
			</span>
		</div>
	`)},n=(i,t)=>{i.on("dblclick",()=>wiki.textEditor(i,t))};typeof window<"u"&&(window.plugins.pagefold={emit:e,bind:n});})();
//# sourceMappingURL=pagefold.js.map
