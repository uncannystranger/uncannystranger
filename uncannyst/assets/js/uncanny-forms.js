(function () {
  "use strict";

  var SUCCESS_CONTACT = "Message sent successfully. Thank you for reaching out.";
  var ERROR_CONTACT = "Sorry, the message could not be sent. Please try again.";
  var SUCCESS_SUBSCRIBE = "Subscribed successfully. Thank you.";
  var ERROR_SUBSCRIBE = "Sorry, the subscription could not be saved. Please try again.";
  var CONFIG_ERROR = "Form endpoint is not configured.";

  function endpoint(name) {
    var endpoints = window.UNCANNY_FORMS_ENDPOINTS || {};
    if (endpoints[name]) return endpoints[name];

    var base = window.UNCANNY_SUPABASE_FUNCTIONS_BASE || "";
    if (base) return base.replace(/\/$/, "") + "/" + name;

    return "";
  }

  function setMessage(node, message, isError) {
    if (!node) return;
    node.textContent = message;
    node.style.display = "block";
    node.setAttribute("aria-hidden", "false");
    node.setAttribute("role", "status");
    node.classList.toggle("is-error", !!isError);
    node.classList.toggle("is-success", !isError);
  }

  function value(form, selector) {
    var field = form.querySelector(selector);
    return field ? field.value.trim() : "";
  }

  function setBusy(form, busy) {
    var button = form.querySelector('button[type="submit"], button:not([type])');
    if (!button) return;
    button.disabled = busy;
    button.setAttribute("aria-busy", busy ? "true" : "false");
  }

  async function postJson(url, payload) {
    if (!url) {
      var error = new Error(CONFIG_ERROR);
      error.isConfigurationError = true;
      throw error;
    }
    var response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    });
    var data = await response.json().catch(function () { return {}; });
    if (!response.ok) throw new Error(data.error || "Request failed.");
    return data;
  }

  function ensureHoneypot(form, name) {
    if (form.querySelector('[name="' + name + '"]')) return;
    var label = document.createElement("label");
    label.style.cssText = "display: none !important;";
    label.textContent = "Leave this field empty if you're human: ";
    var input = document.createElement("input");
    input.type = "text";
    input.name = name;
    input.tabIndex = -1;
    input.autocomplete = "off";
    label.appendChild(input);
    form.appendChild(label);
  }

  function bindContactForm(form) {
    ensureHoneypot(form, "_wpcf7_honeypot");
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var responseNode = form.querySelector(".wpcf7-response-output");
      setBusy(form, true);
      setMessage(responseNode, "Sending...", false);

      try {
        var data = await postJson(endpoint("contact-message"), {
          name: value(form, '[name="your-name"]'),
          email: value(form, '[name="your-email"]'),
          message: value(form, '[name="your-message"]'),
          _wpcf7_honeypot: value(form, '[name="_wpcf7_honeypot"]'),
          sourcePage: window.location.pathname
        });
        setMessage(responseNode, data.message || SUCCESS_CONTACT, false);
        form.reset();
      } catch (error) {
        if (error.isConfigurationError) console.error("[uncannystranger] Contact form endpoint is not configured.");
        setMessage(responseNode, error.isConfigurationError ? ERROR_CONTACT : (error.message || ERROR_CONTACT), true);
      } finally {
        setBusy(form, false);
      }
    });
  }

  function bindSubscribeForm(form) {
    ensureHoneypot(form, "_mc4wp_honeypot");
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var responseNode = form.querySelector(".mc4wp-response");
      setBusy(form, true);
      setMessage(responseNode, "Subscribing...", false);

      try {
        var data = await postJson(endpoint("subscribe"), {
          email: value(form, '[name="EMAIL"]'),
          _mc4wp_honeypot: value(form, '[name="_mc4wp_honeypot"]'),
          sourcePage: window.location.pathname
        });
        setMessage(responseNode, data.message || SUCCESS_SUBSCRIBE, false);
        if (!data.duplicate) form.reset();
      } catch (error) {
        if (error.isConfigurationError) console.error("[uncannystranger] Subscribe form endpoint is not configured.");
        setMessage(responseNode, error.isConfigurationError ? ERROR_SUBSCRIBE : (error.message || ERROR_SUBSCRIBE), true);
      } finally {
        setBusy(form, false);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".wpcf7-form").forEach(bindContactForm);
    document.querySelectorAll(".mc4wp-form").forEach(bindSubscribeForm);
  });
}());
