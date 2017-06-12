'use strict';

import breakpoints from '../../utils/breakpoints';

const loginWidget = (function () {
  const avatarSelector = '#qg-avatar';
  const avatarContainerSelector = '#qg-avatar-container';

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

    $('#qg-site-header').on('qg.avatar.enabled', function () {
      $(this).addClass('with-avatar');
      $(avatarContainerSelector).removeClass('hidden');
    });
  }

  function setLoginIconPosition () {
    const $loginIcon = $(avatarSelector);
    if (window.innerWidth >= breakpoints.bsMd) {
      $('#qg-search-form').after($loginIcon);
    } else {
      $loginIcon.appendTo($(avatarContainerSelector));
    }
  }

  return {
    setLoginIconPosition: setLoginIconPosition,
    init: init,
  };
})();

module.exports = loginWidget;
