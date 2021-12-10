"use strict";

(function () {
  /*
   * Federated Wiki : Mathjax Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-mathjax/blob/master/LICENSE.txt
   */
  window.plugins.mathjax = {
    emit: function emit(div, item) {
      var typeset;

      typeset = function typeset() {
        return window.MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
      };

      wiki.getScript('https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML', typeset);
      return div.append("<p>".concat(wiki.resolveLinks(item.text), "</p>"));
    },
    bind: function bind(div, item) {
      var typeset;

      typeset = function typeset() {
        return window.MathJax.Hub.Queue(["Typeset", MathJax.Hub, div.get(0)]);
      };

      wiki.getScript('https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML', typeset);
      return div.dblclick(function () {
        return wiki.textEditor(div, item);
      });
    }
  };
}).call(void 0);
//# sourceMappingURL=mathjax.js.map
