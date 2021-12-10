"use strict";

(function () {
  /*
   * Federated Wiki : Audio Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-audio/blob/master/LICENSE.txt
   */
  var bind, embed, emit, parse;

  parse = function parse() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var firstLine, i, len, line, ref, result;
    result = {};
    firstLine = true;
    ref = text.split(/\r\n?|\n/);

    for (i = 0, len = ref.length; i < len; i++) {
      line = ref[i];

      if (firstLine) {
        result.key = line;
        firstLine = false;
      } else {
        result.caption || (result.caption = ' ');
        result.caption += line + ' ';
      }
    }

    return result;
  };

  embed = function embed(_ref) {
    var key = _ref.key;
    return "<iframe\n  onload=\"this.height=this.contentWindow.document.body.clientHeight + 5 + 'px'\"\n  srcdoc='<audio src=\"".concat(key, "\" preload=\"none\" controls style=\"width: 100%;\"><a href=\"").concat(key, "\">download audio</a></audio>'\n  width=\"100%\" frameborder=0 seamless scrolling=\"no\">\n</iframe>");
  };

  emit = function emit($item, item) {
    var result;
    result = parse(item.text);
    return $item.append("".concat(embed(result), "\n<br>\n<i>").concat(wiki.resolveLinks(result.caption || "(no caption)"), "</i>"));
  };

  bind = function bind($item, item) {
    return $item.dblclick(function () {
      return wiki.textEditor($item, item);
    });
  };

  if (typeof window !== "undefined" && window !== null) {
    window.plugins.audio = {
      emit: emit,
      bind: bind
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = {
      parse: parse,
      embed: embed
    };
  }
}).call(void 0);
//# sourceMappingURL=audio.js.map
