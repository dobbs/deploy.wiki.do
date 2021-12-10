"use strict";

(function () {
  /*
   * Federated Wiki : Pagefold Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-pagefold/blob/master/LICENSE.txt
   */
  var bind, emit; // http://stackoverflow.com/questions/5214127/css-technique-for-a-horizontal-line-with-words-in-the-middle

  emit = function emit($item, item) {
    return $item.append("<div style=\"height: 10px; border-top: 2px solid lightgray; margin-top: 24px; text-align: center; position: relative; clear: both;\">\n\t<span style=\"position: relative; top: -.8em; background: white; display: inline-block; color: gray; \">\n\t\t&nbsp; ".concat(item.text, " &nbsp;\n\t</span>\n</div>"));
  };

  bind = function bind($item, item) {
    return $item.dblclick(function () {
      return wiki.textEditor($item, item);
    });
  };

  window.plugins.pagefold = {
    emit: emit,
    bind: bind
  };
}).call(void 0);
//# sourceMappingURL=pagefold.js.map
