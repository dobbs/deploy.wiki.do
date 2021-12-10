"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

(function () {
  /*
   * Federated Wiki : Method Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-method/blob/master/LICENSE.txt
   */
  var annotate, _asUnits, _asValue, avg, bind, coerce, conversions, difference, _dispatch, emit, emptyArray, evaluate, extend, findFactor, hasUnits, ident, inspect, isEqual, lexer, packUnits, parseLabel, parseRatio, parseUnits, parser, print, printUnits, product, ratio, round, _simplify, sum, unpackUnits; //########### units ############


  conversions = null;

  _asValue = function asValue(obj) {
    if (obj == null) {
      return 0 / 0;
    }

    switch (obj.constructor) {
      case Number:
        return obj;

      case String:
        return +obj;

      case Array:
        return _asValue(obj[0]);

      case Object:
        return _asValue(obj.value);

      case Function:
        return _asValue(obj());

      default:
        return 0 / 0;
    }
  };

  _asUnits = function asUnits(obj) {
    if (obj == null) {
      return [];
    }

    switch (obj.constructor) {
      case Number:
        return [];

      case String:
        return [];

      case Array:
        return _asUnits(obj[0]);

      case Object:
        if (obj.units != null) {
          return obj.units;
        } else if (obj.value != null) {
          return _asUnits(obj.value);
        } else {
          return [];
        }

        break;

      case Function:
        return units(obj());

      default:
        return [];
    }
  };

  parseUnits = function parseUnits(string) {
    var units;
    string = string.toLowerCase();
    string = string.replace(/\bsquare\s+(\w+)\b/, "$1 $1");
    string = string.replace(/\bcubic\s+(\w+)\b/, "$1 $1 $1");
    units = string.match(/(\w+)/g);

    if (units == null) {
      return [];
    }

    return units.sort();
  };

  parseRatio = function parseRatio(string) {
    var ratio, units;

    if (ratio = string.match(/^\((.+?)\/(.+?)\)$/)) {
      return {
        numerator: parseUnits(ratio[1]),
        denominator: parseUnits(ratio[2])
      };
    } else if (units = string.match(/^\((.+?)\)$/)) {
      return parseUnits(units[1]);
    } else {
      return void 0;
    }
  };

  parseLabel = function parseLabel(string) {
    var phrases, result;

    if (phrases = string.match(/(\(.+?\)).*?(\(.+?\))?[^(]*$/)) {
      result = {};
      result.units = parseRatio(phrases[1]);

      if (phrases[2]) {
        result.from = parseRatio(phrases[2]);
      }
    }

    return result;
  };

  extend = function extend(object, properties) {
    var key, val;

    for (key in properties) {
      val = properties[key];
      object[key] = val;
    }

    return object;
  };

  emptyArray = function emptyArray(obj) {
    return obj.constructor === Array && obj.length === 0;
  };

  _simplify = function simplify(obj) {
    if (obj == null) {
      return 0 / 0;
    }

    switch (obj.constructor) {
      case Number:
        return obj;

      case String:
        return +obj;

      case Array:
        return _simplify(obj[0]);

      case Object:
        if (obj.units === void 0) {
          return _simplify(obj.value);
        } else if (emptyArray(obj.units)) {
          return _simplify(obj.value);
        } else {
          return obj;
        }

        break;

      case Function:
        return _simplify(obj());

      default:
        return 0 / 0;
    }
  };

  inspect = function inspect(obj) {
    if (obj == null) {
      return "nullish";
    }

    switch (obj.constructor) {
      case Number:
        return obj;

      case String:
        return obj;

      case Array:
        return JSON.stringify(obj).replace(/\"/g, '');

      case Object:
        return JSON.stringify(obj).replace(/\"/g, '');

      case Function:
        return 'functionish';

      default:
        return "wierdish";
    }
  };

  findFactor = function findFactor(to, from) {
    var label, value;

    for (label in conversions) {
      value = conversions[label];

      if (value.from != null && isEqual(from, value.from)) {
        if (isEqual(to, value.units)) {
          return _asValue(value);
        }
      }

      if (value.from != null && isEqual(to, value.from)) {
        if (isEqual(from, value.units)) {
          return 1 / _asValue(value);
        }
      }
    }

    return null;
  };

  hasUnits = function hasUnits(obj) {
    return !emptyArray(_asUnits(obj));
  };

  isEqual = function isEqual(a, b) {
    return inspect(a) === inspect(b);
  };

  coerce = function coerce(toUnits, value) {
    var factor, fromUnits; // console.log "coerce to #{inspect toUnits}"

    if (isEqual(toUnits, fromUnits = _asUnits(_simplify(value)))) {
      return value;
    } else if (factor = findFactor(toUnits, fromUnits)) {
      return {
        value: factor * _asValue(value),
        units: toUnits
      };
    } else {
      throw new Error("can't convert to ".concat(inspect(toUnits), " from ").concat(inspect(fromUnits)));
    }
  };

  unpackUnits = function unpackUnits(value) {
    var denominator, numerator, u, v;
    v = _asValue(value);
    u = _asUnits(value);

    if (u.constructor === Array) {
      numerator = u;
      denominator = [];
    } else {
      numerator = u.numerator;
      denominator = u.denominator;
    }

    return [v, numerator, denominator];
  };

  packUnits = function packUnits(nums, denoms) {
    var _ref, _ref2;

    var d, j, keep, len, n, unit, where;
    n = (_ref = []).concat.apply(_ref, _toConsumableArray(nums));
    d = (_ref2 = []).concat.apply(_ref2, _toConsumableArray(denoms));
    keep = [];

    for (j = 0, len = d.length; j < len; j++) {
      unit = d[j];

      if ((where = n.indexOf(unit)) === -1) {
        keep.push(unit);
      } else {
        n.splice(where, 1);
      }
    }

    if (keep.length) {
      return {
        numerator: n.sort(),
        denominator: keep.sort()
      };
    } else {
      return n.sort();
    }
  };

  printUnits = function printUnits(units) {
    if (emptyArray(units)) {
      return '';
    } else if (units.constructor === Array) {
      return "( ".concat(units.join(' '), " )");
    } else {
      return "( ".concat(units.numerator.join(' '), " / ").concat(units.denominator.join(' '), " )");
    }
  }; //########### calculation ############


  sum = function sum(v) {
    return _simplify(v.reduce(function (sum, each) {
      var toUnits, value;
      toUnits = _asUnits(_simplify(each));
      value = coerce(toUnits, sum);
      return {
        value: _asValue(value) + _asValue(each),
        units: toUnits
      };
    }));
  };

  difference = function difference(v) {
    var toUnits, value; // list[0] - list[1]

    toUnits = _asUnits(_simplify(v[1]));
    value = coerce(toUnits, v[0]);
    return {
      value: _asValue(value) - _asValue(v[1]),
      units: toUnits
    };
  };

  product = function product(v) {
    return _simplify(v.reduce(function (prod, each) {
      var e, ed, en, p, pd, pn;

      var _unpackUnits = unpackUnits(prod);

      var _unpackUnits2 = _slicedToArray(_unpackUnits, 3);

      p = _unpackUnits2[0];
      pn = _unpackUnits2[1];
      pd = _unpackUnits2[2];

      var _unpackUnits3 = unpackUnits(each);

      var _unpackUnits4 = _slicedToArray(_unpackUnits3, 3);

      e = _unpackUnits4[0];
      en = _unpackUnits4[1];
      ed = _unpackUnits4[2];
      return {
        value: p * e,
        units: packUnits([pn, en], [pd, ed])
      };
    }));
  };

  ratio = function ratio(v) {
    var d, dd, dn, n, nd, nn; // list[0] / list[1]

    var _unpackUnits5 = unpackUnits(v[0]);

    var _unpackUnits6 = _slicedToArray(_unpackUnits5, 3);

    n = _unpackUnits6[0];
    nn = _unpackUnits6[1];
    nd = _unpackUnits6[2];

    var _unpackUnits7 = unpackUnits(v[1]);

    var _unpackUnits8 = _slicedToArray(_unpackUnits7, 3);

    d = _unpackUnits8[0];
    dn = _unpackUnits8[1];
    dd = _unpackUnits8[2];
    return _simplify({
      value: n / d,
      units: packUnits([nn, dd], [nd, dn])
    });
  };

  avg = function avg(v) {
    return sum(v) / v.length;
  };

  round = function round(n) {
    if (n == null) {
      return '?';
    }

    if (n.toString().match(/\.\d\d\d/)) {
      return n.toFixed(2);
    } else {
      return n;
    }
  };

  annotate = function annotate(text) {
    if (text == null) {
      return '';
    }

    return " <span title=\"".concat(text, "\">*</span>");
  };

  print = function print(report, value, hover, line, comment, color) {
    var linenum = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
    var unpatched = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : value;

    var _long;

    if (report == null) {
      return;
    }

    _long = '';

    if (line.length > 40) {
      _long = line;
      line = "".concat(line.substr(0, 20), " ... ").concat(line.substr(-15));
    }

    return report.push("<tr style=\"background:".concat(color, ";\">\n  <td class=\"value\"\n    data-value=\"").concat(_asValue(unpatched), "\"\n    data-linenum=\"").concat(linenum, "\"\n    style=\"width: 20%; text-align: right; padding: 0 4px;\"\n    title=\"").concat(hover || '', "\">\n      <b>").concat(round(_asValue(value)), "</b>\n  <td title=\"").concat(_long, "\">").concat(line).concat(annotate(comment), "</td>"));
  }; //########### expression ############


  ident = function ident(str, syms) {
    var label, regexp, value;

    if (str.match(/^\d+(\.\d+)?(e\d+)?$/)) {
      return Number(str);
    } else {
      regexp = new RegExp("\\b".concat(str, "\\b"));

      for (label in syms) {
        value = syms[label];

        if (label.match(regexp)) {
          return value;
        }
      }

      throw new Error("can't find value for '".concat(str, "'"));
    }
  };

  lexer = function lexer(str) {
    var syms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var buf, c, i, tmp;
    buf = [];
    tmp = "";
    i = 0;

    while (i < str.length) {
      c = str[i++];

      if (c === " ") {
        continue;
      }

      if (c === "+" || c === "-" || c === "*" || c === "/" || c === "(" || c === ")") {
        if (tmp) {
          buf.push(ident(tmp, syms));
          tmp = "";
        }

        buf.push(c);
        continue;
      }

      tmp += c;
    }

    if (tmp) {
      buf.push(ident(tmp, syms));
    }

    return buf;
  };

  parser = function parser(lexed) {
    var expr, fact, _term; // term : fact { (*|/) fact }
    // fact : number | '(' expr ')'


    fact = function fact() {
      var c, ref;
      c = lexed.shift();

      if ((ref = _typeof(c)) === "number" || ref === "object") {
        return c;
      }

      if (c === "(") {
        c = expr();

        if (lexed.shift() !== ")") {
          throw new Error("missing paren");
        }

        return c;
      }

      throw new Error("missing value");
    };

    _term = function term() {
      var c, o, ref;
      c = fact();

      while ((ref = lexed[0]) === "*" || ref === "/") {
        o = lexed.shift();

        if (o === "*") {
          c = product([c, _term()]);
        }

        if (o === "/") {
          c = ratio([c, _term()]);
        }
      }

      return c;
    };

    expr = function expr() {
      var c, o, ref;
      c = _term();

      while ((ref = lexed[0]) === "+" || ref === "-") {
        o = lexed.shift();

        if (o === "+") {
          c = sum([c, _term()]);
        }

        if (o === "-") {
          c = difference([c, _term()]);
        }
      }

      return c;
    };

    return expr();
  }; //########### interpreter ############


  _dispatch = function dispatch(state, done) {
    var apply, args, attach, change, color, comment, count, err, hover, input, label, line, list, local, lookup, output, patch, polynomial, previous, result, s, show, units, unpatched, v, value;
    state.list || (state.list = []);
    state.input || (state.input = {});
    state.output || (state.output = {});
    state.local || (state.local = {});
    state.patch || (state.patch = {});
    state.lines || (state.lines = state.item.text.split("\n"));
    state.linenum || (state.linenum = 0);
    state.linenum += 1;
    line = state.lines.shift();

    if (line == null) {
      return done(state);
    }

    attach = function attach(search) {
      var elem, j, len, ref, source;
      ref = wiki.getDataNodes(state.div);

      for (j = 0, len = ref.length; j < len; j++) {
        elem = ref[j];

        if ((source = $(elem).data('item')).text.indexOf(search) >= 0) {
          return source.data;
        }
      }

      throw new Error("can't find dataset with caption ".concat(search));
    };

    lookup = function lookup(v) {
      var row, table;
      table = attach('Tier3ExposurePercentages');

      if (isNaN(v[0])) {
        return 0 / 0;
      }

      if (isNaN(v[1])) {
        return 0 / 0;
      }

      row = _.find(table, function (row) {
        return _asValue(row.Exposure) === v[0] && _asValue(row.Raw) === v[1];
      });

      if (row == null) {
        throw new Error("can't find exposure ".concat(v[0], " and raw ").concat(v[1]));
      }

      return _asValue(row.Percentage);
    };

    polynomial = function polynomial(v, subtype) {
      var result, row, table;
      table = attach('Tier3Polynomials');
      row = _.find(table, function (row) {
        return "".concat(row.SubType, " Scaled") === subtype && _asValue(row.Min) <= v && _asValue(row.Max) > v;
      });

      if (row == null) {
        throw new Error("can't find applicable polynomial for ".concat(v, " in '").concat(subtype, "'"));
      }

      result = _asValue(row.C0);
      result += _asValue(row.C1) * v;
      result += _asValue(row.C2) * Math.pow(v, 2);
      result += _asValue(row.C3) * Math.pow(v, 3);
      result += _asValue(row.C4) * Math.pow(v, 4);
      result += _asValue(row.C5) * Math.pow(v, 5);
      result += _asValue(row.C6) * Math.pow(v, 6);

      if (_asValue(row['One minus'])) {
        result = 1 - result;
      }

      return Math.min(1, Math.max(0, result));
    };

    show = function show(list, legend) {
      var readout, value;
      value = sum(list);

      if (emptyArray(_asUnits(parseLabel(legend)))) {
        legend += "<br>".concat(printUnits(_asUnits(value)));
      }

      readout = Number(_asValue(value)).toLocaleString('en');
      state.show || (state.show = []);
      state.show.push({
        readout: readout,
        legend: legend
      });
      return value;
    };

    apply = function apply(name, list) {
      var label = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var result, toUnits;

      result = function () {
        switch (name) {
          case 'SUM':
            return sum(list);

          case 'AVG':
          case 'AVERAGE':
            return avg(list);

          case 'MIN':
          case 'MINIMUM':
            return _.min(list);

          case 'MAX':
          case 'MAXIMUM':
            return _.max(list);

          case 'RATIO':
            return ratio(list);

          case 'ACCUMULATE':
            return sum(list) + (output[label] || input[label] || 0);

          case 'FIRST':
            return list[0];

          case 'PRODUCT':
            return product(list);

          case 'LOOKUP':
            return lookup(list);

          case 'POLYNOMIAL':
            return polynomial(list[0], label);

          case 'SHOW':
            return show(list, label);

          case 'CALC':
            return parser(lexer(label, state.local));

          default:
            throw new Error("don't know how to '".concat(name, "'"));
        }
      }();

      if (name === 'CALC' || emptyArray(toUnits = _asUnits(parseLabel(label)))) {
        return result;
      } else {
        return coerce(toUnits, result);
      }
    };

    unpatched = null;

    patch = function patch(value) {
      unpatched = value;
      return state.patch[state.linenum] || value;
    };

    color = '#eee';
    value = comment = hover = null;
    conversions = input = state.input;
    output = state.output;
    local = state.local;
    list = state.list;
    label = null;

    try {
      // 99.9 Label (units)
      if (args = line.match(/^([0-9.eE-]+) +([\w \.%(){},&\*\/+-]+)$/)) {
        result = patch(+args[1]);
        units = parseLabel(label = args[2]);

        if (units) {
          result = extend({
            value: result
          }, units);
        }

        local[label] = output[label] = value = result; // OPERATION Label (units)
      } else if (args = line.match(/^([A-Z]+) +([\w \.%(){},&\*\/+-]+)$/)) {
        var _ref3 = [apply(args[1], list, args[2]), [], list.length];
        value = _ref3[0];
        list = _ref3[1];
        count = _ref3[2];
        color = '#ddd';
        hover = "".concat(args[1], " of ").concat(count, " numbers\n= ").concat(_asValue(value), " ").concat(printUnits(_asUnits(value)));
        label = args[2];

        if ((output[label] != null || input[label] != null) && !state.item.silent) {
          previous = _asValue(output[label] || input[label]);

          if (Math.abs(change = value / previous - 1) > 0.0001) {
            comment = "previously ".concat(previous, "\n\u0394 ").concat(round(change * 100), "%");
          }
        }

        local[label] = output[label] = value;

        if ((s = state.item.checks) && (v = s[label]) !== void 0) {
          if (_asValue(v).toFixed(4) !== _asValue(value).toFixed(4)) {
            color = '#faa';
            label += " != ".concat(_asValue(v).toFixed(4));

            if (state.caller) {
              state.caller.errors.push({
                message: label
              });
            }
          }
        } // OPERATION

      } else if (args = line.match(/^([A-Z]+)$/)) {
        var _ref4 = [apply(args[1], list), [], list.length];
        value = _ref4[0];
        list = _ref4[1];
        count = _ref4[2];
        value = patch(value);
        local[args[1]] = value;
        color = '#ddd';
        hover = "".concat(args[1], " of ").concat(count, " numbers\n= ").concat(_asValue(value), " ").concat(printUnits(_asUnits(value))); // 99.9
      } else if (line.match(/^[0-9\.eE-]+$/)) {
        value = patch(+line);
        label = ''; // Label
      } else if (args = line.match(/^ *([\w \.%(){},&\*\/+-]+)$/)) {
        if (output[args[1]] != null) {
          local[args[1]] = value = patch(output[args[1]]);
        } else if (input[args[1]] != null) {
          local[args[1]] = value = patch(input[args[1]]);
        } else {
          color = '#edd';
          comment = "can't find value of '".concat(line, "'");
        }
      } else {
        color = '#edd';
        comment = "can't parse '".concat(line, "'");
      }
    } catch (error) {
      err = error;
      color = '#edd';
      value = null; // console.log "trouble", inspect statck

      comment = err.message;
    }

    if (state.caller != null && color === '#edd') {
      state.caller.errors.push({
        message: comment
      });
    }

    state.list = list;

    if (value != null && !isNaN(_asValue(value))) {
      state.list.push(value);
    } // console.log "#{line} => #{inspect state.list} #{comment||''}"


    print(state.report, value, hover, label || line, comment, color, state.linenum, unpatched);
    return _dispatch(state, done);
  }; //########### interface ############


  bind = function bind(div, item) {};

  emit = function emit(div, item, done) {
    var candidates, elem, handleScrub, input, j, len, output, ref, ref1, refresh, scrub, state;
    input = {};
    output = {};

    refresh = function refresh(state) {
      var $show, each, j, label, len, ref, ref1, ref2, results, results1, table, text, value;

      if (state.show) {
        state.div.addClass("data");
        state.div.append($show = $("<div>"));
        ref = state.show;
        results = [];

        for (j = 0, len = ref.length; j < len; j++) {
          each = ref[j];
          results.push($show.append($("<p class=readout>".concat(each.readout, "</p>\n<p class=legend>").concat(each.legend, "</p>"))));
        }

        return results;
      } else {
        text = state.report.join("\n");
        table = $('<table style="width:100%; background:#eee; padding:.8em; margin-bottom:5px;"/>').html(text);
        state.div.append(table);

        if (input['debug']) {
          ref1 = state.output;

          for (label in ref1) {
            value = ref1[label];
            state.div.append($("<p class=error>".concat(label, " =><br> ").concat(inspect(value), "</p>")));
          }
        }

        if (output['debug']) {
          ref2 = state.input;
          results1 = [];

          for (label in ref2) {
            value = ref2[label];
            results1.push(state.div.append($("<p class=error>".concat(label, " =><br> ").concat(inspect(value), "</p>"))));
          }

          return results1;
        }
      }
    };

    scrub = function scrub(e, $td, $b) {
      var patch, scale, state, width;
      patch = {};

      if (e.shiftKey) {
        // from http://bugs.jquery.com/ticket/8523#comment:16
        if (typeof e.offsetX === "undefined") {
          e.offsetX = e.pageX - $(e.target).offset().left;
        }

        console.log('scrub', e);
        width = $td.width() / 2;
        scale = Math.pow(2, (e.offsetX - width) / width);
        scale = Math.min(2, Math.max(0.5, scale));
        patch[$td.data('linenum')] = $td.data('value') * scale;
      }

      state = {
        div: div,
        item: item,
        input: input,
        output: output,
        report: [],
        patch: patch
      };
      return _dispatch(state, function (state) {
        div.empty();
        return refresh(state);
      });
    };

    handleScrub = function handleScrub(e) {
      var $target;
      $target = $(e.target);

      if ($target.is('td')) {
        $(div).triggerHandler('thumb', $target.text());
      }

      if ($target.is('td.value')) {
        scrub(e, $target, $target.find('b'));
      }

      if ($target.is('b')) {
        return scrub(e, $target.parent(), $target);
      }
    };

    candidates = $(".item:lt(".concat($('.item').index(div), ")"));

    for (j = 0, len = candidates.length; j < len; j++) {
      elem = candidates[j];
      elem = $(elem);

      if (elem.hasClass('radar-source')) {
        _.extend(input, elem.get(0).radarData());
      } else if (elem.hasClass('data')) {
        _.extend(input, (ref = elem.data('item')) != null ? (ref1 = ref.data) != null ? ref1[0] : void 0 : void 0);
      }
    }

    div.addClass('radar-source');

    div.get(0).radarData = function () {
      return output;
    };

    div.mousemove(function (e) {
      return handleScrub(e);
    });
    div.dblclick(function (e) {
      if (e.shiftKey) {
        return wiki.dialog("JSON for Method plugin", $('<pre/>').text(JSON.stringify(item, null, 2)));
      } else {
        return wiki.textEditor(state.div, state.item);
      }
    });
    state = {
      div: div,
      item: item,
      input: input,
      output: output,
      report: []
    };
    return _dispatch(state, function (state) {
      refresh(state);
      return setTimeout(done, 10); // slower is better for firefox
    });
  };

  evaluate = function evaluate(caller, item, input, done) {
    var state;
    state = {
      caller: caller,
      item: item,
      input: input,
      output: {}
    };
    return _dispatch(state, function (state, input) {
      return done(state.caller, state.output);
    });
  };

  if (typeof window !== "undefined" && window !== null) {
    window.plugins.method = {
      emit: emit,
      bind: bind,
      eval: evaluate
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = {
      lexer: lexer,
      parser: parser,
      dispatch: _dispatch,
      asValue: _asValue,
      asUnits: _asUnits,
      hasUnits: hasUnits,
      simplify: _simplify,
      parseUnits: parseUnits,
      parseRatio: parseRatio,
      parseLabel: parseLabel
    };
  }
}).call(void 0);
//# sourceMappingURL=method.js.map
