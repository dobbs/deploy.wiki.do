"use strict";

(function () {
  /*
   * Federated Wiki : Flagmatic Plugin
   *
   * Copyright Ward Cunningham and other contributors
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-flagmatic/blob/master/LICENSE.txt
   */
  var bind, delay, emit, hsltorgb, paint; // The Flagmatic plugin offers a choice of new flags
  // item.choices selects how may, 40 by default

  hsltorgb = function hsltorgb(h, s, l) {
    var hue, m1, m2;
    h = h % 360 / 360;
    m2 = l * (s + 1);
    m1 = l * 2 - m2;

    hue = function hue(num) {
      if (num < 0) {
        num += 1;
      } else if (num > 1) {
        num -= 1;
      }

      if (num * 6 < 1) {
        return m1 + (m2 - m1) * num * 6;
      } else if (num * 2 < 1) {
        return m2;
      } else if (num * 3 < 2) {
        return m1 + (m2 - m1) * (2 / 3 - num) * 6;
      } else {
        return m1;
      }
    };

    return [hue(h + 1 / 3) * 255, hue(h) * 255, hue(h - 1 / 3) * 255];
  };

  paint = function paint(canvas) {
    var angle, colprep, cos, ctx, dark, i, light, p, results, scale, sin, x, y;
    ctx = canvas.getContext('2d');
    light = hsltorgb(Math.random() * 360, .78, .4);
    dark = hsltorgb(Math.random() * 360, .78, .55);
    angle = 2 * (Math.random() - 0.5);
    sin = Math.sin(angle);
    cos = Math.cos(angle);
    scale = Math.abs(sin) + Math.abs(cos);

    colprep = function colprep(col, p) {
      return Math.floor(light[col] * p + dark[col] * (1 - p)) % 255;
    };

    results = [];

    for (x = i = 0; i <= 31; x = ++i) {
      results.push(function () {
        var j, results1;
        results1 = [];

        for (y = j = 0; j <= 31; y = ++j) {
          p = sin >= 0 ? sin * x + cos * y : -sin * (31 - x) + cos * y;
          p = p / 31 / scale;
          ctx.fillStyle = "rgba(".concat(colprep(0, p), ", ").concat(colprep(1, p), ", ").concat(colprep(2, p), ", 1)");
          results1.push(ctx.fillRect(x, y, 1, 1));
        }

        return results1;
      }());
    }

    return results;
  };

  delay = function delay(msec, done) {
    return setTimeout(done, msec);
  };

  emit = function emit($item, item) {
    var $flag, $flags, i, ref, results;
    $item.append("<div style=\"width:93%; background:#eee; padding:.8em; margin-bottom:5px; text-align: center;\">\n  <span class=\"flags\"></span>\n  <p class=\"caption\">choose a new flag</p>\n</div>");
    $flags = $item.find('.flags');
    results = [];

    for (i = 1, ref = item.choices || 40; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
      $flags.append($flag = $('<canvas width=32 height=32 style="padding: 3px;"/>'));
      results.push(paint($flag.get(0)));
    }

    return results;
  };

  bind = function bind($item, item) {
    return $item.find('canvas').click(function () {
      var ajax, data;
      data = this.toDataURL();
      ajax = $.post('/favicon.png', {
        image: data
      }, function (reply) {});
      ajax.done(function () {
        return $item.find('.caption').text('sweet');
      });
      ajax.error(function () {
        return $item.find('.caption').text('ouch, logged in?');
      });
      return delay(1500, function () {
        return $item.find('.caption').text('choose another flag');
      });
    });
  };

  if (typeof window !== "undefined" && window !== null) {
    window.plugins.flagmatic = {
      emit: emit,
      bind: bind
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = {};
  }
}).call(void 0);
//# sourceMappingURL=flagmatic.js.map
