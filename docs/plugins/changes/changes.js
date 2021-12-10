"use strict";

(function () {
  /*
   * Federated Wiki : Changes Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-changes/blob/master/LICENSE.txt
   */
  var constructor, escape, listItemHtml, pageBundle;

  escape = function escape(line) {
    return line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  listItemHtml = function listItemHtml(slug, title) {
    return "<li>\n  <a class=\"internal\" href=\"#\" title=\"local\" data-page-name=\"".concat(slug, "\" data-site=\"local\">").concat(escape(title), "</a>\n  <button class=\"delete\">\u2715</button>\n</li>");
  };

  pageBundle = function pageBundle() {
    var bundle, i, j, length, ref, slug;
    bundle = {};
    length = localStorage.length;

    for (i = j = 0, ref = length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      slug = localStorage.key(i);
      bundle[slug] = JSON.parse(localStorage.getItem(slug));
    }

    return bundle;
  };

  constructor = function constructor($) {
    var dependencies = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var bind, emit, localStorage;
    localStorage = dependencies.localStorage || window.localStorage;

    emit = function emit($div, item) {
      var i, j, page, ref, slug, ul;

      if (localStorage.length === 0) {
        $div.append('<ul><p><i>no local changes</i></p></ul>');
        return;
      }

      $div.append(ul = $('<ul />'));

      for (i = j = 0, ref = localStorage.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        slug = localStorage.key(i);
        page = JSON.parse(localStorage.getItem(slug));

        if (page.title != null) {
          ul.append(listItemHtml(slug, page.title));
        }
      }

      if (localStorage.length > 0) {
        if (item.submit != null) {
          return ul.append("<button class=\"submit\">Submit Changes</button>");
        } else {
          return $div.append("<p> Click <i>Export Changes</i> to download changed pages as <i>".concat(location.hostname, ".json</i>.\nDrag-and-drop this file to import pages elsewhere.</p>\n<ul><button class=\"export\">Export Changes</button></ul>"));
        }
      }
    };

    bind = function bind($div, item) {
      $div.on('click', '.delete', function () {
        var slug;
        slug = $(this).siblings('a.internal').data('pageName');
        localStorage.removeItem(slug);
        return emit($div.empty(), item);
      });
      $div.on('click', '.submit', function () {
        return $.ajax({
          type: 'PUT',
          url: "/submit",
          data: {
            'bundle': JSON.stringify(pageBundle())
          },
          success: function success(citation, textStatus, jqXHR) {
            var before, beforeElement, itemElement, pageElement;
            wiki.log("ajax submit success", citation, textStatus, jqXHR);

            if (!(citation.type && citation.site)) {
              throw new Exception("Incomplete Submission");
            }

            pageElement = $div.parents('.page:first');
            itemElement = $("<div />", {
              "class": "item ".concat(citation.type)
            }).data('item', citation).attr('data-id', citation.id);
            itemElement.data('pageElement', pageElement);
            pageElement.find(".story").append(itemElement);
            wiki.doPlugin(itemElement, citation);
            beforeElement = itemElement.prev('.item');
            before = wiki.getItem(beforeElement);
            return wiki.pageHandler.put(pageElement, {
              item: citation,
              id: citation.id,
              type: "add",
              after: before != null ? before.id : void 0
            });
          },
          error: function error(xhr, type, msg) {
            return wiki.log("ajax error callback", type, msg);
          }
        });
      });
      $div.on('click', '.export', function () {
        var anchor;
        anchor = document.createElement('a');
        document.body.appendChild(anchor);
        anchor.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(pageBundle())));
        anchor.setAttribute('download', location.hostname + '.json');
        anchor.click();
        return document.body.removeChild(anchor);
      });
      return $div.dblclick(function () {
        var bundle, count;
        bundle = pageBundle();
        count = _.size(bundle);
        return wiki.dialog("JSON bundle for ".concat(count, " pages"), $('<pre/>').text(JSON.stringify(bundle, null, 2)));
      });
    };

    return {
      emit: emit,
      bind: bind
    };
  };

  wiki.registerPlugin('changes', constructor);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = constructor;
  }
}).call(void 0);
//# sourceMappingURL=changes.js.map
