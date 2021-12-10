"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function () {
  /*
   * Federated Wiki : Code Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-code/blob/master/LICENSE.txt
   */
  var escape;

  escape = function escape(str) {
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  window.plugins.code = function () {
    var load;

    var code = /*#__PURE__*/function () {
      function code() {
        _classCallCheck(this, code);
      }

      _createClass(code, null, [{
        key: "emit",
        value: function emit(div, item) {
          return load(function () {
            return div.append("<pre class='prettyprint'>".concat(prettyPrintOne(escape(item.text)), "</pre>"));
          });
        }
      }, {
        key: "bind",
        value: function bind(div, item) {
          return load(function () {
            return div.dblclick(function () {
              return wiki.textEditor(div, item);
            });
          });
        }
      }]);

      return code;
    }();

    ;

    load = function load(callback) {
      wiki.getScript('/plugins/code/prettify.js', callback);

      if (!$("link[href='/plugins/code/prettify.css']").length) {
        return $('<link href="/plugins/code/prettify.css" rel="stylesheet" type="text/css">').appendTo("head");
      }
    };

    return code;
  }.call(this);
}).call(void 0);
//# sourceMappingURL=code.js.map
