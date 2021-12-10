"use strict";

(function () {
  /*
   * Federated Wiki : Favicon Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-favicon/blob/master/LICENSE.txt
   */
  var hsltorgb; // ** favicon.coffee **
  // This is a brute force port of Ward's favicon.rb,
  // and could do with some refactoring by someone
  // who knows the canvas api, but it would be better
  // to move favicon generation to the client side.  This
  // could serve as a basis for that with enough refactoring.
  // Utility functions

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

  window.plugins.favicon = {
    create: function create() {
      var angle, canvas, colprep, cos, ctx, dark, fav, i, j, light, p, scale, sin, x, y;
      $('body').append($('<canvas />').attr('width', 32).attr('height', 32).attr('id', 'favmaker').attr('display', 'none').hide());
      canvas = document.getElementById('favmaker');
      ctx = canvas.getContext('2d');
      light = hsltorgb(Math.random() * 360, .78, .50);
      dark = hsltorgb(Math.random() * 360, .78, .25);
      angle = 2 * (Math.random() - 0.5);
      sin = Math.sin(angle);
      cos = Math.cos(angle);
      scale = Math.abs(sin) + Math.abs(cos);

      colprep = function colprep(col, p) {
        return Math.floor(light[col] * p + dark[col] * (1 - p)) % 255;
      };

      for (x = i = 0; i <= 31; x = ++i) {
        for (y = j = 0; j <= 31; y = ++j) {
          p = sin >= 0 ? sin * x + cos * y : -sin * (31 - x) + cos * y;
          p = p / 31 / scale;
          ctx.fillStyle = "rgba(".concat(colprep(0, p), ", ").concat(colprep(1, p), ", ").concat(colprep(2, p), ", 1)");
          ctx.fillRect(x, y, 1, 1);
        }
      }

      fav = canvas.toDataURL();
      $('#favicon').attr('href', fav);
      $('.favicon').attr('src', fav);
      return $.post('/favicon.png', {
        image: fav
      }, function (data) {
        return console.log(data);
      });
    }
  };
}).call(void 0);
//# sourceMappingURL=favicon.js.map
