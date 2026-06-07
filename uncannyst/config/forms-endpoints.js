window.UNCANNY_SUPABASE_FUNCTIONS_BASE = "https://fptlhlbkizpptmzaneee.supabase.co/functions/v1";

(function () {
  "use strict";

  var base = window.UNCANNY_SUPABASE_FUNCTIONS_BASE.replace(/\/$/, "");

  window.UNCANNY_FORMS_ENDPOINTS = Object.assign({
    "contact-message": base + "/contact-message",
    "subscribe": base + "/subscribe",
    "subscribe-email": base + "/subscribe-email",
    "unsplash-cache": base + "/unsplash-cache",
    "prints-catalog": base + "/prints-catalog",
    "prints-create-order": base + "/prints-create-order",
    "prints-contact": base + "/prints-contact",
    "print-orders": base + "/prints-create-order",
    "invoices": base + "/invoices",
    "checkout-records": base + "/checkout-records"
  }, window.UNCANNY_FORMS_ENDPOINTS || {});

  window.UNCANNY_UNSPLASH_ENDPOINT = window.UNCANNY_UNSPLASH_ENDPOINT || window.UNCANNY_FORMS_ENDPOINTS["unsplash-cache"];
  window.UNCANNY_PRINTS_CATALOG_ENDPOINT = window.UNCANNY_PRINTS_CATALOG_ENDPOINT || window.UNCANNY_FORMS_ENDPOINTS["prints-catalog"];
}());
