"use strict";

(function () {
  /*
   * Federated Wiki : Report Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-report/blob/master/LICENSE.txt
   */
  var advance, bind, emit, enumerate, explain, hours, human, intervals, months, parse, primAdvance, soon, summarize, wdays;

  enumerate = function enumerate() {
    var i, j, k, len, obj;

    for (var _len = arguments.length, keys = new Array(_len), _key = 0; _key < _len; _key++) {
      keys[_key] = arguments[_key];
    }

    obj = {
      keys: keys
    };

    for (i = j = 0, len = keys.length; j < len; i = ++j) {
      k = keys[i];
      obj[k] = i + 1;
    }

    return obj;
  };

  intervals = enumerate('HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');
  hours = enumerate('MIDNIGHT', 'MORNING', 'NOON', 'EVENING');
  wdays = enumerate('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');
  months = enumerate('JANUARY', 'FEBUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER');

  parse = function parse(text) {
    var e, issue, j, len, ref, schedule, word;
    schedule = [];
    issue = null;
    ref = text.match(/\S+/g) || [];

    for (j = 0, len = ref.length; j < len; j++) {
      word = ref[j];

      try {
        if (intervals[word]) {
          schedule.push(issue = {
            interval: word,
            recipients: [],
            offsets: []
          });
        } else if (months[word] || wdays[word] || hours[word]) {
          issue.offsets.push(word);
        } else if (word.match(/@/)) {
          issue.recipients.push(word);
        } else {
          schedule.push({
            trouble: word
          });
        }
      } catch (error) {
        e = error;
        schedule.push({
          trouble: e.message
        });
      }
    }

    return schedule;
  };

  human = function human(msecs) {
    var days, hrs, mins, secs, weeks, years;

    if ((secs = msecs / 1000) < 2) {
      return "".concat(Math.floor(msecs), " milliseconds");
    }

    if ((mins = secs / 60) < 2) {
      return "".concat(Math.floor(secs), " seconds");
    }

    if ((hrs = mins / 60) < 2) {
      return "".concat(Math.floor(mins), " minutes");
    }

    if ((days = hrs / 24) < 2) {
      return "".concat(Math.floor(hrs), " hours");
    }

    if ((weeks = days / 7) < 2) {
      return "".concat(Math.floor(days), " days");
    }

    if ((months = days / 30.5) < 2) {
      return "".concat(Math.floor(weeks), " weeks");
    }

    if ((years = days / 365) < 2) {
      return "".concat(Math.floor(months), " months");
    }

    return "".concat(Math.floor(years), " years");
  };

  primAdvance = function primAdvance(date, issue, count) {
    var d, h, j, len, m, offset, ref, result, y;
    var _ref = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()];
    y = _ref[0];
    m = _ref[1];
    d = _ref[2];
    h = _ref[3];

    result = function () {
      switch (issue.interval) {
        case 'HOURLY':
          return new Date(y, m, d, h + count);

        case 'DAILY':
          return new Date(y, m, d + count);

        case 'WEEKLY':
          return new Date(y, m, d - date.getDay() + 7 * count);

        case 'MONTHLY':
          return new Date(y, m + count);

        case 'YEARLY':
          return new Date(y + count, 0);
      }
    }();

    ref = issue.offsets;

    for (j = 0, len = ref.length; j < len; j++) {
      offset = ref[j];
      var _ref2 = [result.getFullYear(), result.getMonth(), result.getDate(), result.getHours()];
      y = _ref2[0];
      m = _ref2[1];
      d = _ref2[2];
      h = _ref2[3];
      result = months[offset] ? new Date(y, months[offset] - 1, d, h) : wdays[offset] ? new Date(y, m, d + (7 - result.getDay() + wdays[offset] - 1) % 7, h) : hours[offset] ? new Date(y, m, d, h + 6 * (hours[offset] - 1)) : void 0;
    }

    return result;
  };

  advance = function advance(date, issue, count) {
    var prim;
    prim = primAdvance(date, issue, 0);

    if (prim > date) {
      return primAdvance(date, issue, count - 1); // when offset passes date
    } else {
      return primAdvance(date, issue, count);
    }
  };

  soon = function soon(issue) {
    var next, now;
    now = new Date();
    next = advance(now, issue, 1);
    return human(next.getTime() - now.getTime());
  };

  explain = function explain(issue) {
    if (issue.interval != null) {
      return "reporting ".concat(issue.interval, " for ").concat(issue.recipients.length, " recipients in ").concat(soon(issue));
    } else if (issue.trouble != null) {
      return "don't expect: <span class=error>".concat(issue.trouble, "</span>");
    } else {
      return "trouble";
    }
  };

  if (typeof module !== "undefined" && module !== null) {
    module.exports = {
      intervals: intervals,
      parse: parse,
      explain: explain,
      advance: advance
    };
  }

  summarize = function summarize(schedule) {
    var issue;
    return function () {
      var j, len, results;
      results = [];

      for (j = 0, len = schedule.length; j < len; j++) {
        issue = schedule[j];
        results.push(explain(issue));
      }

      return results;
    }().join("<br>");
  };

  emit = function emit($item, item) {
    return $item.append($("<p>".concat(summarize(parse(item.text)), "</p>")));
  };

  bind = function bind($item, item) {
    return $item.dblclick(function () {
      return wiki.textEditor($item, item);
    });
  };

  if (typeof window !== "undefined" && window !== null) {
    window.plugins.report = {
      emit: emit,
      bind: bind
    };
  }
}).call(void 0);
//# sourceMappingURL=report.js.map
