/* Profilecode shared analytics loader.
   Replaces the per-page inline gtag snippet. Safe to include on any page:
   double-inclusion and pages that still carry a legacy inline snippet are
   both guarded by __pcGA / existing window.gtag detection. */
(function () {
  'use strict';

  var GA_ID = 'G-8RSCZGH62Y';

  if (window.__pcGA) return;
  window.__pcGA = true;

  // A legacy inline snippet may already have defined gtag; reuse it instead
  // of loading the library twice.
  if (typeof window.gtag !== 'function') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  // Canonical event names (existing events keep their historical names so
  // GA4 reporting stays continuous; new features add to this map).
  window.PC_EVENTS = {
    TEST_STARTED: 'test_started',
    TEST_COMPLETED: 'test_completed',
    TEST_RESTARTED: 'test_restarted',
    RESULT_VIEWED: 'result_viewed',
    RESULT_TAB_VIEWED: 'result_tab_viewed',
    APP_LINK_CLICKED: 'app_link_clicked',
    BACK_TO_TOP: 'back_to_top',
    COMPAT_SHARE_OPENED: 'compat_share_opened',
    COMPAT_LINK_CREATED: 'compat_link_created',
    COMPAT_LINK_OPENED: 'compat_link_opened',
    COMPAT_GATE_TEST_STARTED: 'compat_gate_test_started',
    COMPAT_COMPARED: 'compat_compared',
    COMPAT_APP_CLICKED: 'compat_app_clicked',
    COMPAT_PERMLINK_CREATED: 'compat_permlink_created',
    COMPAT_PERMLINK_OPENED: 'compat_permlink_opened',
    COMPAT_SIGNUP: 'compat_signup_from_compat',
    COMPAT_GROUP_APP_CLICKED: 'compat_group_app_clicked'
  };

  window.pcTrack = function (eventName, params) {
    try {
      window.gtag('event', eventName, params || {});
    } catch (e) {
      /* analytics must never break the page */
    }
  };
})();
