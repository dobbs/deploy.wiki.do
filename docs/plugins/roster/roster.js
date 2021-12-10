"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

(function () {
  /*
   * Federated Wiki : Roster Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-roster/blob/master/LICENSE.txt
   */
  var bind, emit, escape, includes, load_sites, parse; // Sample Roster Accessing Code
  // Any item that exploses a roster will be identifed with class "roster-source".
  // These items offer the method getRoster() for retrieving the roster object.
  // Convention has roster consumers looking left for the nearest (or all) such objects.
  //     items = $(".item:lt(#{$('.item').index(div)})")
  //     if (sources = items.filter ".roster-source").size()
  //       choice = sources[sources.length-1]
  //       roster = choice.getRoster()
  // This simplified version might be useful from the browser's javascript inspector.
  //     $('.roster-source').get(0).getRoster()

  includes = {};

  escape = function escape(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  load_sites = function load_sites(uri) {
    var results, site, tuples;
    tuples = uri.split(' ');
    results = [];

    while (tuples.length) {
      site = tuples.shift();
      results.push(wiki.neighborhoodObject.registerNeighbor(site));
    }

    return results;
  };

  parse = function parse($item, item) {
    var cat, category, expand, flag, includeReferences, includeRoster, lines, lineup, marks, more, newline, roster;
    roster = {
      all: []
    };
    category = null;
    lineup = [];
    marks = {};
    lines = [];

    if ($item != null) {
      $item.addClass('roster-source');

      $item.get(0).getRoster = function () {
        return roster;
      };
    }

    more = item.text.split(/\r?\n/);

    flag = function flag(site) {
      var br;
      roster.all.push(site);
      lineup.push(site);
      br = lineup.length >= 18 ? newline() : '';
      return "<img class=\"remote\" src=\"".concat(wiki.site(site).flag(), "\" title=\"").concat(site, "\" data-site=\"").concat(site, "\" data-slug=\"welcome-visitors\">").concat(br);
    };

    newline = function newline() {
      var j, len, site, sites;

      if (lineup.length) {
        var _ref = [lineup, []];
        sites = _ref[0];
        lineup = _ref[1];

        if (category != null) {
          roster[category] || (roster[category] = []);

          for (j = 0, len = sites.length; j < len; j++) {
            site = sites[j];
            roster[category].push(site);
          }
        }

        return " <a class='loadsites' href= \"/#\" data-sites=\"".concat(sites.join(' '), "\" title=\"add these ").concat(sites.length, " sites\nto neighborhood\">\xBB</a><br> ");
      } else {
        return "<br>";
      }
    };

    cat = function cat(name) {
      return category = name;
    };

    includeRoster = function includeRoster(line, siteslug) {
      var site, slug;

      if (marks[siteslug] != null) {
        return "<span>trouble looping ".concat(siteslug, "</span>");
      } else {
        marks[siteslug] = true;
      }

      if (includes[siteslug] != null) {
        [].unshift.apply(more, includes[siteslug]);
        return '';
      } else {
        var _siteslug$split = siteslug.split('/');

        var _siteslug$split2 = _slicedToArray(_siteslug$split, 2);

        site = _siteslug$split2[0];
        slug = _siteslug$split2[1];
        wiki.site(site).get("".concat(slug, ".json"), function (error, page) {
          var i, j, len, ref; // $.getJSON "//#{siteslug}.json", (page) ->

          if (error) {
            return console.log("unable to get ".concat(siteslug));
          } else {
            includes[siteslug] = ["<span>trouble loading ".concat(siteslug, "</span>")];
            ref = page.story;

            for (j = 0, len = ref.length; j < len; j++) {
              i = ref[j];

              if (i.type === 'roster') {
                includes[siteslug] = i.text.split(/\r?\n/);
                break;
              }
            }

            $item.empty();
            emit($item, item);
            return bind($item, item);
          }
        });
        return "<span>loading ".concat(siteslug, "</span>");
      }
    };

    includeReferences = function includeReferences(line, siteslug) {
      var site, slug;

      if (includes[siteslug] != null) {
        [].unshift.apply(more, includes[siteslug]);
        return '';
      } else {
        var _siteslug$split3 = siteslug.split('/');

        var _siteslug$split4 = _slicedToArray(_siteslug$split3, 2);

        site = _siteslug$split4[0];
        slug = _siteslug$split4[1];
        wiki.site(site).get("".concat(slug, ".json"), function (error, page) {
          var i, j, len, ref; // $.getJSON "//#{siteslug}.json", (page) ->

          if (error) {
            return console.log("unable to get ".concat(siteslug));
          } else {
            includes[siteslug] = [];
            ref = page.story;

            for (j = 0, len = ref.length; j < len; j++) {
              i = ref[j];

              if (i.type === 'reference') {
                if (includes[siteslug].indexOf(i.site) < 0) {
                  includes[siteslug].push(i.site);
                }
              }
            }

            $item.empty();
            emit($item, item);
            return bind($item, item);
          }
        });
        return "<span>loading ".concat(siteslug, "</span>");
      }
    };

    expand = function expand(text) {
      return text.replace(/^$/, newline).replace(/^([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(:\d+)?$/, flag).replace(/^localhost(:\d+)?$/, flag).replace(/^ROSTER ([A-Za-z0-9.-:]+\/[a-z0-9-]+)$/, includeRoster).replace(/^REFERENCES ([A-Za-z0-9.-:]+\/[a-z0-9-]+)$/, includeReferences).replace(/^([^<].*)$/, cat);
    };

    while (more.length) {
      lines.push(expand(more.shift()));
    }

    lines.push(newline());
    return lines.join(' ');
  };

  emit = function emit($item, item) {
    return $item.append("<p style=\"background-color:#eee;padding:15px;\">\n  ".concat(parse($item, item), "\n</p>"));
  };

  bind = function bind($item, item) {
    $item.dblclick(function (e) {
      if (e.shiftKey) {
        return wiki.dialog("Roster Categories", "<pre>".concat(JSON.stringify($item.get(0).getRoster(), null, 2), "</pre>"));
      } else {
        return wiki.textEditor($item, item);
      }
    });
    return $item.find('.loadsites').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('roster sites', $(e.target).data('sites').split(' '));
      return load_sites($(e.target).data('sites'));
    });
  };

  if (typeof window !== "undefined" && window !== null) {
    window.plugins.roster = {
      emit: emit,
      bind: bind
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = {
      parse: parse,
      includes: includes
    };
  }
}).call(void 0);
//# sourceMappingURL=roster.js.map
