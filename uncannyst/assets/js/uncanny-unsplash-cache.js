(function () {
  "use strict";

  var USERNAME = "uncannystranger";
  var EDGE_ENDPOINT = window.UNCANNY_UNSPLASH_ENDPOINT || "";
  var ENABLE_REMOTE_UNSPLASH = window.UNCANNY_ENABLE_REMOTE_UNSPLASH === true;
  var CACHE_KEY = "uncannystranger.unsplash.images.v5";
  var CACHE_TTL = 1000 * 60 * 60 * 6;
  var FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1780577524963-60db4f08ba42",
    "https://images.unsplash.com/photo-1780577480820-a156e46a3e0b",
    "https://images.unsplash.com/photo-1780574779701-be775b5844bb",
    "https://images.unsplash.com/photo-1780574851829-e048d73e3bb9",
    "https://images.unsplash.com/photo-1780574851939-9113c2a90064",
    "https://images.unsplash.com/photo-1780574751868-39b0ffdbac32",
    "https://images.unsplash.com/photo-1780574851856-d7b16d3e3633",
    "https://images.unsplash.com/photo-1780574766076-003832fe47cb",
    "https://images.unsplash.com/photo-1780574751775-bea2e6401126",
    "https://images.unsplash.com/photo-1780469312979-d2032eea4539",
    "https://images.unsplash.com/photo-1779805775304-7d6db169240b",
    "https://images.unsplash.com/photo-1779494557319-275396d519cb",
    "https://images.unsplash.com/photo-1779494557226-1c7de7aed038",
    "https://images.unsplash.com/photo-1779493981365-2e7c70c2be69",
    "https://images.unsplash.com/photo-1779493015876-bf5fe2477b34",
    "https://images.unsplash.com/photo-1779493016105-28a736b01ede",
    "https://images.unsplash.com/photo-1779493015878-02452ea6cce4",
    "https://images.unsplash.com/photo-1778764710694-d6e5c1f4c2f5",
    "https://images.unsplash.com/photo-1778070919041-00a979a63e74",
    "https://images.unsplash.com/photo-1777671640121-4697e8217313",
    "https://images.unsplash.com/photo-1777671640067-974b4815a54d",
    "https://images.unsplash.com/photo-1777671640092-3b0acd6a7896",
    "https://images.unsplash.com/photo-1777671640116-4c4f700b8719",
    "https://images.unsplash.com/photo-1777671640086-870e9d0bf7a9",
    "https://images.unsplash.com/photo-1777671640113-693abf024118",
    "https://images.unsplash.com/photo-1777671640065-fa81b6568c80",
    "https://images.unsplash.com/photo-1777670858067-1c959ced726b",
    "https://images.unsplash.com/photo-1777670858094-c33261b9ab21",
    "https://images.unsplash.com/photo-1777670858076-70159d792ec2",
    "https://images.unsplash.com/photo-1777670858230-0a59e3d825da"
  ].map(function (url, index) {
    return {
      id: "fallback-" + index,
      alt: "Photography by Uncanny Stranger",
      width: 1600,
      height: 1200,
      urls: {
        raw: url,
        small: buildUnsplashUrl(url, 640, 82),
        regular: buildUnsplashUrl(url, 1200, 84),
        full: buildUnsplashUrl(url, 1800, 85)
      }
    };
  });

  var PROFILE_IMAGE = {
    id: "7PdUGlHwmh8",
    alt: "Photography by Uncanny Stranger",
    width: 1250,
    height: 833,
    urls: {
      raw: "https://images.unsplash.com/photo-1760008780659-6ac16a68e012",
      small: buildUnsplashUrl("https://images.unsplash.com/photo-1760008780659-6ac16a68e012", 640, 82),
      regular: buildUnsplashUrl("https://images.unsplash.com/photo-1760008780659-6ac16a68e012", 1200, 84),
      full: buildUnsplashUrl("https://images.unsplash.com/photo-1760008780659-6ac16a68e012", 1800, 85)
    }
  };

  function normalizeImage(image) {
    var raw = image && image.urls && (image.urls.raw || image.urls.full || image.urls.regular);
    var id = image && image.id ? image.id : "unsplash-photo";
    var alt = image && (image.alt_description || image.description || image.alt);
    if (!raw) return null;

    return {
      id: id,
      alt: alt || "Photography by Uncanny Stranger",
      width: image.width || 1600,
      height: image.height || 1200,
      urls: {
        raw: raw,
        small: image.urls.small || buildUnsplashUrl(raw, 640, 82),
        regular: image.urls.regular || buildUnsplashUrl(raw, 1200, 84),
        full: image.urls.full || buildUnsplashUrl(raw, 1800, 85)
      },
      links: image.links || {}
    };
  }

  function imageKey(image) {
    var raw = image && image.urls && (image.urls.raw || image.urls.full || image.urls.regular);
    var cleanRaw = raw ? raw.split("?")[0] : "";
    var photoPath = cleanRaw.match(/photo-[^/?#]+/);
    return [
      image && image.id ? "id:" + image.id : "",
      photoPath ? "photo:" + photoPath[0] : "",
      cleanRaw ? "raw:" + cleanRaw : ""
    ].filter(Boolean);
  }

  function normalizeImages(images) {
    if (!Array.isArray(images)) return [];
    var seen = {};
    return images.map(normalizeImage).filter(Boolean).filter(function (image) {
      var keys = imageKey(image);
      var duplicate = keys.some(function (key) { return seen[key]; });
      keys.forEach(function (key) { seen[key] = true; });
      return !duplicate;
    });
  }

  function buildUnsplashUrl(rawUrl, width, quality) {
    rawUrl = rawUrl.split("?")[0];
    return rawUrl + "?auto=format&fit=crop&w=" + width + "&q=" + quality;
  }

  function srcsetFor(image) {
    return [
      image.urls.small + " 640w",
      image.urls.regular + " 1200w",
      image.urls.full + " 1800w"
    ].join(", ");
  }

  function imageForSlot(images, slot) {
    if (slot === "profile") return PROFILE_IMAGE;
    var index = Number.parseInt(slot, 10);
    if (!Number.isFinite(index)) index = 0;
    return images[index % images.length] || PROFILE_IMAGE;
  }

  function shouldRewriteLink(link) {
    if (!link) return false;
    if (link.closest(".elementor-post")) return false;
    if (link.closest(".vlt-single-post")) return false;
    if (link.classList.contains("elementor-post__thumbnail__link")) return false;
    if (link.classList.contains("elementor-post__read-more")) return false;

    var href = link.getAttribute("href") || "";
    if (/^\/pages\//.test(href) || /^\/index\.html/.test(href)) return false;

    return link.hasAttribute("data-fancybox") ||
      link.closest(".vp-portfolio__item") ||
      /^(https?:)?\/\/images\.unsplash\.com\//i.test(href) ||
      /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/i.test(href);
  }

  function applyImage(element, image) {
    var regular = image.urls.regular || image.urls.full || image.urls.raw;
    var full = image.urls.full || regular;
    var alt = image.alt || "Photography by Uncanny Stranger";

    element.classList.add("is-uncanny-loading");

    if (element.tagName === "IMG") {
      element.setAttribute("src", regular);
      element.setAttribute("data-src", regular);
      element.setAttribute("srcset", srcsetFor(image));
      element.setAttribute("data-srcset", srcsetFor(image));
      element.setAttribute("sizes", element.getAttribute("sizes") || "(max-width: 1200px) 100vw, 1200px");
      element.setAttribute("alt", alt);
      element.setAttribute("loading", element.getAttribute("loading") || "lazy");
      element.setAttribute("decoding", "async");
    } else {
      element.style.backgroundImage = "url(\"" + regular + "\")";
      element.setAttribute("data-thumbnail", regular);
      element.setAttribute("aria-label", alt);
    }

    var link = element.closest("a");
    if (shouldRewriteLink(link)) {
      link.setAttribute("href", full);
      link.setAttribute("aria-label", alt);
      link.removeAttribute("target");
      link.removeAttribute("rel");
      if (!link.hasAttribute("data-fancybox") && !link.hasAttribute("data-elementor-open-lightbox")) {
        link.setAttribute("data-fancybox", "uncanny-gallery");
        link.setAttribute("data-type", "image");
      }
    }

    window.requestAnimationFrame(function () {
      element.classList.remove("is-uncanny-loading");
      element.classList.add("is-uncanny-ready");
    });
  }

  function hydrate(images) {
    var slots = document.querySelectorAll("[data-uncanny-image-slot]:not([data-uncanny-image-fixed])");
    for (var i = 0; i < slots.length; i += 1) {
      applyImage(slots[i], imageForSlot(images, slots[i].getAttribute("data-uncanny-image-slot")));
    }
  }

  function getCachedImages() {
    try {
      var cached = JSON.parse(window.localStorage.getItem(CACHE_KEY) || "null");
      if (!cached || !Array.isArray(cached.images)) return [];
      if (Date.now() - cached.timestamp > CACHE_TTL) return [];
      return normalizeImages(cached.images);
    } catch (error) {
      return [];
    }
  }

  function setCachedImages(images) {
    try {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        images: images
      }));
    } catch (error) {
      // Storage can be disabled in private browsing; the live API path still works.
    }
  }

  async function loadFromEdge() {
    if (!ENABLE_REMOTE_UNSPLASH || !EDGE_ENDPOINT) return [];
    var response = await fetch(EDGE_ENDPOINT + "?username=" + encodeURIComponent(USERNAME) + "&limit=200", {
      headers: { "Accept": "application/json" }
    });
    if (!response.ok) throw new Error("Image cache request failed");
    var payload = await response.json();
    return normalizeImages(payload.images);
  }

  async function loadImages() {
    var cached = getCachedImages();
    if (cached.length) return cached;

    try {
      var edgeImages = await loadFromEdge();
      if (edgeImages.length) return edgeImages;
    } catch (error) {
      console.warn("[uncannystranger] Supabase Unsplash cache unavailable:", error.message);
    }

    return FALLBACK_IMAGES;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      loadImages().then(hydrate);
    });
  } else {
    loadImages().then(hydrate);
  }
}());
