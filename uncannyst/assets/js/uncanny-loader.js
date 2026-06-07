(function () {
  "use strict";

  var LOADED_CLASS = "vlt-is-page-loaded";
  var ACTIVE_CLASS = "uncanny-loader-is-active";
  var HIDDEN_CLASS = "uncanny-loader-is-hidden";
  var FAILSAFE_MS = 4500;
  var IN_DURATION_MS = 500;
  var REMOVE_AFTER_MS = 500;
  var loaderNode = null;
  var startedAt = Date.now();
  var didMarkLoaded = false;

  function loadingClass() {
    if (!document.body) return "animsition-bounce";
    return document.body.getAttribute("data-animsition-style") || "animsition-bounce";
  }

  function loadingMarkup(style) {
    if (style === "animsition-image" && window.VLT_LOCALIZE_DATAS && window.VLT_LOCALIZE_DATAS.preloader_image) {
      return '<img src="' + window.VLT_LOCALIZE_DATAS.preloader_image + '" alt="preloader">';
    }

    return '<span class="double-bounce-one"></span><span class="double-bounce-two"></span>';
  }

  function originalAnimsitionIsAvailable() {
    return Boolean(
      document.body &&
      document.body.classList.contains("animsition") &&
      window.jQuery &&
      window.jQuery.fn &&
      window.jQuery.fn.animsition
    );
  }

  function triggerSiteLoaded() {
    if (window.jQuery) {
      window.jQuery(window).trigger("vlt.site-loaded");
    }
  }

  function ensureLoader() {
    var style = loadingClass();
    if (loaderNode || document.documentElement.querySelector(":scope > ." + style)) return;

    loaderNode = document.createElement("div");
    loaderNode.className = style;
    loaderNode.setAttribute("aria-hidden", "true");
    loaderNode.innerHTML = loadingMarkup(style);

    document.documentElement.classList.add(ACTIVE_CLASS);
    document.documentElement.appendChild(loaderNode);
  }

  function removeLoader() {
    if (loaderNode && loaderNode.parentNode) {
      loaderNode.parentNode.removeChild(loaderNode);
    }
    loaderNode = null;
  }

  function markLoaded() {
    if (didMarkLoaded) return;
    if (document.documentElement.classList.contains(LOADED_CLASS)) {
      didMarkLoaded = true;
      removeLoader();
      return;
    }

    didMarkLoaded = true;

    var elapsed = Date.now() - startedAt;
    var delay = Math.max(0, IN_DURATION_MS - elapsed);

    window.setTimeout(function () {
      document.documentElement.classList.add(LOADED_CLASS);
      document.documentElement.classList.remove(ACTIVE_CLASS);
      triggerSiteLoaded();

      if (loaderNode) {
        loaderNode.classList.add(HIDDEN_CLASS);
        window.setTimeout(removeLoader, REMOVE_AFTER_MS);
      }
    }, delay);
  }

  function init() {
    if (originalAnimsitionIsAvailable()) {
      window.setTimeout(function () {
        if (!document.documentElement.classList.contains(LOADED_CLASS)) {
          document.documentElement.classList.add(LOADED_CLASS);
          triggerSiteLoaded();
        }
      }, FAILSAFE_MS);
      return;
    }

    ensureLoader();

    if (document.readyState === "complete") {
      markLoaded();
    } else {
      window.addEventListener("load", markLoaded, { once: true });
    }

    window.setTimeout(function () {
      if (!document.documentElement.classList.contains(LOADED_CLASS)) {
        markLoaded();
      }
    }, FAILSAFE_MS);

    window.addEventListener("pageshow", function (event) {
      if (event.persisted) markLoaded();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}());
