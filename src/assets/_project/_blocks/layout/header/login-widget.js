'use strict';

import breakpoints from '../../utils/breakpoints';

const loginWidget = (function () {
  function init () {
    setLoginIconPosition();

    $(window).resize(function () {
      setLoginIconPosition();
    });

    $(document).on('click', '#qg-btn-logout, #qg-btn-login, #qg-btn-create-account', function () {
      if (localStorage) {
          localStorage.setItem('callback', location.pathname);
      }
    });
  }

  function setLoginIconPosition () {
    const $loginIcon = $('#qg-avatar');
    if (window.innerWidth >= breakpoints.bsMd) {
      $('#qg-search-form').after($loginIcon);
    } else {
      $loginIcon.appendTo($('#qg-avatar-container'));
    }
  }

  return {
    setLoginIconPosition: setLoginIconPosition,
    init: init,
  };
})();

module.exports = loginWidget;
