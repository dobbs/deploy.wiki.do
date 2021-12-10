"use strict";

(function () {
  /*
   * Federated Wiki : Reference Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-reference/blob/master/LICENSE.txt
   */
  window.plugins.reference = window.plugins.federatedWiki = {
    emit: function emit($item, item) {
      var site, slug;
      slug = item.slug || 'welcome-visitors';
      site = item.site;
      return wiki.resolveFrom(site, function () {
        return $item.append("<p>\n  <img class='remote'\n    src='//".concat(site, "/favicon.png'\n    title='").concat(site, "'\n    data-site=\"").concat(site, "\"\n    data-slug=\"").concat(slug, "\"\n  >\n  ").concat(wiki.resolveLinks("[[".concat(item.title || slug, "]]")), "\n</p>\n<div>\n  ").concat(wiki.resolveLinks(item.text), "\n</div>"));
      });
    },
    bind: function bind($item, item) {
      return $item.dblclick(function () {
        return wiki.textEditor($item, item);
      });
    }
  };
}).call(void 0);
//# sourceMappingURL=reference.js.map
