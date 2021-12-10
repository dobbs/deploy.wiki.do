"use strict";

(function () {
  /*
   * Federated Wiki : Video Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-video/blob/master/LICENSE.txt
   */
  var UrlAdapter, bind, embed, emit, parse;

  parse = function parse() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var args, err, i, len, line, ref, result, url;
    result = {};
    ref = text.split(/\r\n?|\n/);

    for (i = 0, len = ref.length; i < len; i++) {
      line = ref[i];

      if (args = line.match(/^\s*([A-Z0-9]{3,})\s+([\w\.\-\/+0-9]+)\s*$/)) {
        result.player = args[1];
        result.options = '';
        result.key = args[2];
      } else if (args = line.match(/^\s*([A-Z0-9]{3,})\s+([A-Z\,]+)\s+([\w\.\-\/+0-9]+)\s*$/)) {
        result.player = args[1];
        result.options = args[2];
        result.key = args[3];
      } else if (args = line.match(/^\s*(HTML5)\s+([A-Za-z0-9]+)\s+(.+)\s*$/)) {
        try {
          url = new UrlAdapter(args[3]);
        } catch (error) {
          err = error;
          console.log("failed to parse URL: ".concat(err));
        }

        result.player = args[1];
        result.options = args[2];
        result.key = url.href;
      } else {
        result.caption || (result.caption = ' ');
        result.caption += line + ' ';
      }
    }

    return result;
  };

  embed = function embed(_ref) {
    var player = _ref.player,
        options = _ref.options,
        key = _ref.key;

    switch (player) {
      case 'YOUTUBE':
        if (options.toUpperCase() === "PLAYLIST") {
          return "<iframe\n  width=\"420\" height=\"236\"\n  src=\"https://www.youtube-nocookie.com/embed/videoseries?list=".concat(key, "\"\n  frameborder=\"0\"\n  allowfullscreen>\n</iframe>");
        } else {
          return "<iframe\n  width=\"420\" height=\"236\"\n  src=\"https://www.youtube-nocookie.com/embed/".concat(key, "?rel=0\"\n  frameborder=\"0\"\n  allowfullscreen>\n</iframe>");
        }

        break;

      case 'VIMEO':
        return "<iframe\n  src=\"https://player.vimeo.com/video/".concat(key, "?title=0&amp;byline=0&amp;portrait=0\"\n  width=\"420\" height=\"236\"\n  frameborder=\"0\"\n  allowfullscreen>\n</iframe>");

      case 'ARCHIVE':
        return "<iframe\n  src=\"https://archive.org/embed/".concat(key, "\"\n  width=\"420\" height=\"315\"\n  frameborder=\"0\" webkitallowfullscreen=\"true\" mozallowfullscreen=\"true\"\n  allowfullscreen>\n</iframe>");

      case 'TED':
        return "<iframe\n  src=\"https://embed-ssl.ted.com/talks/".concat(key, ".html\"\n  width=\"420\" height=\"300\"\n  frameborder=\"0\" scrolling=\"no\" webkitAllowFullScreen mozallowfullscreen\n  allowFullScreen>\n</iframe>");

      case 'TEDX':
        return "<iframe\n  src=\"http://tedxtalks.ted.com/video/".concat(key, "/player?layout=&amp;read_more=1\"\n  width=\"420\" height=\"300\"\n  frameborder=\"0\" scrolling=\"no\">\n</iframe>");

      case 'CHANNEL9':
        return "<iframe\n  src=\"https://channel9.msdn.com/".concat(key, "/player\"\n  width=\"420\" height=\"236\"\n  allowFullScreen frameBorder=\"0\">\n</iframe>");

      case 'HTML5':
        return "<video controls width=\"100%\">\n  <source src=\"".concat(key, "\"\n          type=\"video/").concat(options, "\">\n</video>");

      default:
        return "(unknown player)";
    }
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
    UrlAdapter = URL;
  }

  if (typeof module !== "undefined" && module !== null) {
    UrlAdapter = require('url').URL;
  }

  if (typeof window !== "undefined" && window !== null) {
    window.plugins.video = {
      emit: emit,
      bind: bind,
      UrlAdapter: UrlAdapter
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = {
      parse: parse,
      embed: embed,
      UrlAdapter: UrlAdapter
    };
  }
}).call(void 0);
//# sourceMappingURL=video.js.map
