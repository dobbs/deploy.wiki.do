(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
 * Federated Wiki : Social Security Plugin
 *
 * Licensed under the MIT license.
 * https://github.com/fedwiki/wiki-security-social/blob/master/LICENSE.txt
 */
/*
1. Display login button - if there is no authenticated user
2. Display logout button - if the user is authenticated

3. When user authenticated, claim site if unclaimed - and repaint footer.

*/
var setup, update_footer;

update_footer = function(ownerName, isAuthenticated) {
  var signonTitle;
  // we update the owner and the login state in the footer, and
  // populate the security dialog
  if (ownerName) {
    $('footer > #site-owner').html(`Site Owned by: <span id='site-owner' style='text-transform:capitalize;'>${ownerName}</span>`);
  }
  $('footer > #security').empty();
  if (isAuthenticated) {
    if (isOwner) {
      $('footer > #security').append("<a href='#' id='logout' class='footer-item' title='Sign-out'><i class='fas fa-lock-open fa-fw'></i></a>");
    } else {
      $('footer > #security').append("<a href='#' id='logout' class='footer-item' title='Not Owner : Sign-out'><i class='fas fa-lock fa-fw notOwner'></i></a>");
    }
    return $('footer > #security > #logout').on('click', function(e) {
      var myInit;
      e.preventDefault();
      myInit = {
        method: 'GET',
        cache: 'no-cache',
        mode: 'same-origin',
        credentials: 'include'
      };
      return fetch('/logout', myInit).then(function(response) {
        if (response.ok) {
          window.isAuthenticated = false;
          return update_footer(ownerName, false);
        } else {
          return console.log('logout failed: ', response);
        }
      });
    });
  } else {
    if (!isClaimed) {
      signonTitle = 'Claim this Wiki';
      $('footer > #security').append(`<a href='#' id='show-security-dialog' class='footer-item' title='${signonTitle}'><i class='fas fa-lock fa-fw'></i></a>`);
      return $('footer > #security > #show-security-dialog').on('click', function(e) {
        var myInit;
        myInit = {
          method: 'POST',
          cache: 'no-cache',
          mode: 'same-origin',
          credentials: 'include'
        };
        return fetch('/login', myInit).then(function(response) {
          console.log('login response', response);
          if (response.ok) {
            return response.json().then(function(json) {
              ownerName = json.ownerName;
              window.isClaimed = true;
              window.isAuthenticated = true;
              return update_footer(ownerName, true);
            });
          } else {
            return console.log('login failed: ', response);
          }
        });
      });
    } else {
      signonTitle = 'Reclaim this Wiki';
      $('footer > #security').append(`<a href='#' id='show-security-dialog' class='footer-item' title='${signonTitle}'><i class='fas fa-lock fa-fw'></i></a>`);
      return $('footer > #security > #show-security-dialog').on('click', function(e) {
        var reclaimDialog;
        reclaimDialog = document.getElementById('reclaim');
        return reclaimDialog.showModal();
      });
    }
  }
};

setup = function(user) {
  var confirmBtn, dialog, reclaimDialog, reclaimEl;
  if (!$("link[href='/fontawesome/css/fontawesome.min.css']").length) {
    $('<link rel="stylesheet" href="/security/fontawesome/css/fontawesome.min.css"> <link rel="stylesheet" href="/security/fontawesome/css/solid.min.css">').appendTo("head");
  }
  if (!$("link[href='/security/style.css']").length) {
    $('<link rel="stylesheet" href="/security/style.css">').appendTo("head");
  }
  dialog = `<dialog id="reclaim">
  <form method="dialog">
    <h1>Welcome back ${ownerName}.</h1>
    <p>Please enter your reclaim code.</p>
    <input type="password" id="reclaimcode" name="reclaim" required>
    <div>
      <menu>
        <li><button formmethod="dialog" value="">Cancel</button></li>
        <li><button autofocus id="confirmBtn" value="default">Submit</button></li>
      </menu>
    </div>
  </form>
</dialog>`;
  if (!document.getElementById('reclaim')) {
    $(dialog).appendTo("body");
    reclaimDialog = document.getElementById('reclaim');
    reclaimEl = reclaimDialog.querySelector('#reclaimcode');
    confirmBtn = reclaimDialog.querySelector('#confirmBtn');
    confirmBtn.addEventListener('click', function(event) {
      event.preventDefault();
      return reclaimDialog.close(reclaimEl.value);
    });
    reclaimEl.addEventListener('change', function(event) {
      return confirmBtn.value = reclaimEl.value;
    });
    reclaimDialog.addEventListener('close', function(event) {
      var data, myInit, reclaimCode;
      event.preventDefault();
      reclaimCode = reclaimDialog.returnValue;
      if (reclaimCode !== '') {
        data = new FormData();
        data.append("json", JSON.stringify({
          reclaimCode: reclaimCode
        }));
        myInit = {
          method: 'POST',
          cache: 'no-cache',
          mode: 'same-origin',
          credentials: 'include',
          body: reclaimCode
        };
        return fetch('/auth/reclaim/', myInit).then(function(response) {
          console.log('reclaim response', response);
          if (response.ok) {
            window.isAuthenticated = true;
            window.isOwner = true;
            return update_footer(ownerName, true);
          } else {
            return console.log('reclaim failed: ', response);
          }
        });
      }
    });
  }
  return update_footer(ownerName, isAuthenticated);
};

window.plugins.security = {setup, update_footer};


},{}]},{},[1]);
