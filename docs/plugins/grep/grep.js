"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

(function () {
  /*
   * Federated Wiki : Grep Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-grep/blob/master/LICENSE.txt
   */
  var bind, emit, escape, evalPage, evalPart, open_all, parse, run, word;

  escape = function escape(line) {
    return line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  word = function word(string) {
    if (!string.match(/^[a-z]*$/)) {
      throw {
        message: "expecting type for '".concat(string, "'")
      };
    }

    return string;
  };

  parse = function parse(text) {
    var arg, err, errors, html, i, len, line, listing, match, op, program, ref;
    program = [];
    listing = [];
    errors = 0;
    ref = text.split("\n");

    for (i = 0, len = ref.length; i < len; i++) {
      line = ref[i];
      html = escape(line);

      try {
        var _line$match = line.match(/^\s*(\w*)\s*(.*)$/);

        var _line$match2 = _slicedToArray(_line$match, 3);

        match = _line$match2[0];
        op = _line$match2[1];
        arg = _line$match2[2];

        switch (op) {
          case '':
            break;

          case 'ITEM':
          case 'ACTION':
            program.push({
              op: op,
              type: word(arg)
            });
            break;

          case 'TEXT':
          case 'TITLE':
          case 'SITE':
          case 'ID':
          case 'ALIAS':
          case 'JSON':
            program.push({
              op: op,
              regex: new RegExp(arg, 'mi')
            });
            break;

          default:
            throw {
              message: "don't know '".concat(op, "' command")
            };
        }
      } catch (error) {
        err = error;
        errors++;
        html = "<span style=\"background-color:#fdd;width:100%;\" title=\"".concat(err.message, "\">").concat(html, "</span>");
      }

      listing.push(html);
    }

    return [program, listing.join('<br>'), errors];
  };

  evalPage = function evalPage(page, steps, count) {
    var action, i, item, j, len, len1, ref, ref1, step;

    if (!(count < steps.length)) {
      return true;
    }

    step = steps[count];

    switch (step.op) {
      case 'ITEM':
        count++;
        ref = page.story || [];

        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];

          if (step.type === '') {
            if (evalPart(item, steps, count)) {
              return true;
            }
          } else {
            if (item.type === step.type) {
              if (evalPart(item, steps, count)) {
                return true;
              }
            }
          }
        }

        return false;

      case 'ACTION':
        count++;
        ref1 = page.journal || [];

        for (j = 0, len1 = ref1.length; j < len1; j++) {
          action = ref1[j];

          if (step.type === '') {
            if (evalPart(action, steps, count)) {
              return true;
            }
          } else {
            if (action.type === step.type) {
              if (evalPart(action, steps, count)) {
                return true;
              }
            }
          }
        }

        return false;
    }

    return evalPart(page, steps, count);
  };

  evalPart = function evalPart(part, steps, count) {
    var json, key, ref, step;

    if (!(count < steps.length)) {
      return true;
    }

    step = steps[count++];

    switch (step.op) {
      case 'TEXT':
      case 'TITLE':
      case 'SITE':
      case 'ID':
      case 'ALIAS':
        key = step.op.toLowerCase();

        if ((part[key] || ((ref = part.item) != null ? ref[key] : void 0) || '').match(step.regex)) {
          return true;
        }

        break;

      case 'JSON':
        json = JSON.stringify(part, null, ' ');

        if (json.match(step.regex)) {
          return true;
        }

    }

    return false;
  };

  run = function run($item, program) {
    var status, want;

    status = function status(text) {
      return $item.find('.caption').text(text);
    };

    want = function want(page) {
      return evalPage(page, program, 0);
    };

    status("fetching sitemap");
    return $.getJSON("//".concat(location.host, "/system/sitemap.json"), function (sitemap) {
      var checked, found, i, len, place, results;
      checked = 0;
      found = 0;
      results = [];

      for (i = 0, len = sitemap.length; i < len; i++) {
        place = sitemap[i];
        results.push($.getJSON("//".concat(location.host, "/").concat(place.slug, ".json"), function (page) {
          var report, text;
          text = "[[".concat(page.title, "]] (").concat(page.story.length, ")");

          if (want(page)) {
            found++;
            $item.find('.result').append("".concat(wiki.resolveLinks(text), "<br>"));
          }

          checked++;
          report = "found ".concat(found, " pages of ").concat(checked, " checked");

          if (checked < sitemap.length) {
            report += ", ".concat(sitemap.length - checked, " remain");
          }

          return status(report);
        }));
      }

      return results;
    });
  };

  emit = function emit($item, item) {
    var caption, errors, listing, program;

    var _parse = parse(item.text);

    var _parse2 = _slicedToArray(_parse, 3);

    program = _parse2[0];
    listing = _parse2[1];
    errors = _parse2[2];
    caption = errors ? "".concat(errors, " errors") : 'ready';
    return $item.append("<div style=\"background-color:#eee;padding:15px;\">\n  <div style=\"text-align:center\">\n    <div class=listing>".concat(listing, " <a class=open href='#'>\xBB</a></div>\n    <button>find</button>\n    <p class=\"caption\">").concat(caption, "</p>\n  </div>\n  <p class=\"result\"></p>\n</div>"));
  };

  open_all = function open_all(this_page, titles) {
    var i, len, results, title;
    results = [];

    for (i = 0, len = titles.length; i < len; i++) {
      title = titles[i];
      wiki.doInternalLink(title, this_page);
      results.push(this_page = null);
    }

    return results;
  };

  bind = function bind($item, item) {
    $item.dblclick(function () {
      return wiki.textEditor($item, item);
    });
    $item.find('button').click(function (e) {
      var errors, listing, program;

      var _parse3 = parse(item.text);

      var _parse4 = _slicedToArray(_parse3, 3);

      program = _parse4[0];
      listing = _parse4[1];
      errors = _parse4[2];

      if (!errors) {
        return run($item, program);
      }
    });
    return $item.find('a.open').click(function (e) {
      var this_page;
      e.stopPropagation();
      e.preventDefault();

      if (!e.shiftKey) {
        this_page = $item.parents('.page');
      }

      return open_all(this_page, $item.find('a.internal').map(function () {
        return $(this).text();
      }));
    });
  };

  if (typeof window !== "undefined" && window !== null) {
    window.plugins.grep = {
      emit: emit,
      bind: bind
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = {
      parse: parse,
      evalPart: evalPart,
      evalPage: evalPage
    };
  }
}).call(void 0);
//# sourceMappingURL=grep.js.map
