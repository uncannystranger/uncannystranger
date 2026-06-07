(function () {
  "use strict";

  var CATALOG_ENDPOINT = window.UNCANNY_PRINTS_CATALOG_ENDPOINT || "";
  var UNSPLASH_ENDPOINT = window.UNCANNY_UNSPLASH_ENDPOINT || "";
  var ENABLE_REMOTE_UNSPLASH = window.UNCANNY_ENABLE_REMOTE_UNSPLASH === true;
  var ENABLE_REMOTE_CATALOG = window.UNCANNY_ENABLE_REMOTE_PRINTS_CATALOG === true;
  var INSTAGRAM_URL = "https://instagram.com/uncannystranger";
  var DEFAULT_SIZES = [
    { id: "size-9x12", label: "9x12", price: "DM for price" },
    { id: "size-12x18", label: "12x18", price: "DM for price" },
    { id: "size-16x24", label: "16x24", price: "DM for price" },
    { id: "size-24x36", label: "24x36", price: "DM for price" }
  ];
  var MATERIALS = ["Professional Paper", "Fine Art Paper", "Canvas Print"];
  var BORDERS = ["No Border", "White Border", "Black Border"];

  var siteImages = [
    { id: "H48D21tbWTE", alt: "Sunlight filters through a large tree with power lines.", raw: "https://images.unsplash.com/photo-1780577524963-60db4f08ba42" },
    { id: "ZRWWPkGLZNk", alt: "Bright sun illuminates a narrow street between buildings and trees.", raw: "https://images.unsplash.com/photo-1780577480820-a156e46a3e0b" },
    { id: "HY37wQakMhE", alt: "A weathered teal gate with graffiti, surrounded by green trees.", raw: "https://images.unsplash.com/photo-1780574779701-be775b5844bb" },
    { id: "5IRNVo8rjbY", alt: "Sunlit doorway of a vibrant blue and green building.", raw: "https://images.unsplash.com/photo-1780574851829-e048d73e3bb9" },
    { id: "1qG4bt-9wKU", alt: "Green tree growing beside dilapidated buildings under a clear sky.", raw: "https://images.unsplash.com/photo-1780574851939-9113c2a90064" },
    { id: "yb91tivk-7c", alt: "A blue wall and barred window caught between shadow and light.", raw: "https://images.unsplash.com/photo-1780574751868-39b0ffdbac32" },
    { id: "CRLXtDaDy0Y", alt: "A turquoise window glows softly against a worn wall.", raw: "https://images.unsplash.com/photo-1780574851856-d7b16d3e3633" },
    { id: "ZjhllEgudvA", alt: "Clothes drying outside simple houses under dappled sunlight.", raw: "https://images.unsplash.com/photo-1780574766076-003832fe47cb" },
    { id: "nxdG6VcdXpk", alt: "Old building with green tree and blue plastic bag.", raw: "https://images.unsplash.com/photo-1780574751775-bea2e6401126" },
    { id: "DZsBRZ-ZZV4", alt: "A quiet corner of Mogadishu where old walls, soft sunlight, and rising buildings meet.", raw: "https://images.unsplash.com/photo-1780469312979-d2032eea4539" },
    { id: "t_U1LBg7nhU", alt: "Photography by Uncanny Stranger", raw: "https://images.unsplash.com/photo-1779805775304-7d6db169240b" },
    { id: "DIrmH6JCyZc", alt: "A person in a blue plaid shirt holding a camera.", raw: "https://images.unsplash.com/photo-1779494557319-275396d519cb" },
    { id: "pTDupD4sNkk", alt: "A quiet detail from Mogadishu with warm patterns and sunlight.", raw: "https://images.unsplash.com/photo-1779494557226-1c7de7aed038" },
    { id: "rn6u6qfZV-4", alt: "A person leans against a stool, hand on forehead.", raw: "https://images.unsplash.com/photo-1779493981365-2e7c70c2be69" },
    { id: "1kanQ80gVlo", alt: "Illuminated arena sign with gamepad icon on a building at night.", raw: "https://images.unsplash.com/photo-1779493015876-bf5fe2477b34" },
    { id: "bNbB0kKE7YU", alt: "A brown butterfly rests on a vibrant blue textured wall.", raw: "https://images.unsplash.com/photo-1779493016105-28a736b01ede" },
    { id: "asICPzF6aPs", alt: "Two young men standing in a hallway with windows.", raw: "https://images.unsplash.com/photo-1779493015878-02452ea6cce4" },
    { id: "J5p1E5uKjJ0", alt: "A warm Somali tea moment in Mogadishu.", raw: "https://images.unsplash.com/photo-1778764710694-d6e5c1f4c2f5" },
    { id: "pyQKxWBvpEM", alt: "Cargo ships and cranes in a busy harbor.", raw: "https://images.unsplash.com/photo-1778070919041-00a979a63e74" },
    { id: "-sP6ygGXd2k", alt: "Photography by Uncanny Stranger", raw: "https://images.unsplash.com/photo-1777671640121-4697e8217313" },
    { id: "HUIxER9U01Y", alt: "Photography by Uncanny Stranger", raw: "https://images.unsplash.com/photo-1777671640067-974b4815a54d" },
    { id: "6Tb53fdDxt4", alt: "Photography by Uncanny Stranger", raw: "https://images.unsplash.com/photo-1777671640092-3b0acd6a7896" },
    { id: "yMZ5Y2y5t8I", alt: "Photography by Uncanny Stranger", raw: "https://images.unsplash.com/photo-1777671640116-4c4f700b8719" },
    { id: "Fd-VPPyI-mc", alt: "Photography by Uncanny Stranger", raw: "https://images.unsplash.com/photo-1777671640086-870e9d0bf7a9" },
    { id: "QDkiMATUE-Q", alt: "Photography by Uncanny Stranger", raw: "https://images.unsplash.com/photo-1777671640113-693abf024118" },
    { id: "GMV307LlXjI", alt: "Photography by Uncanny Stranger", raw: "https://images.unsplash.com/photo-1777671640065-fa81b6568c80" },
    { id: "2QuIKvdHNTI", alt: "Exterior view of a cozy cafe at dusk.", raw: "https://images.unsplash.com/photo-1777670858067-1c959ced726b" },
    { id: "hihmEojaViE", alt: "Sunlight casts tree shadows on a wall.", raw: "https://images.unsplash.com/photo-1777670858094-c33261b9ab21" },
    { id: "6Mw8IZ7x7P8", alt: "Photography by Uncanny Stranger", raw: "https://images.unsplash.com/photo-1777670858076-70159d792ec2" },
    { id: "cNGW82G8M7E", alt: "Photography by Uncanny Stranger", raw: "https://images.unsplash.com/photo-1777670858230-0a59e3d825da" }
  ];

  var state = { products: [], selected: null, cart: [] };

  function by(selector) {
    return document.querySelector(selector);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
    });
  }

  function unsplashUrl(raw, width, quality) {
    if (!raw) return "";
    var base = raw.split("?")[0];
    return base + "?auto=format&fit=crop&w=" + width + "&q=" + quality;
  }

  function imageUrl(product, size) {
    return product.image && product.image.urls && (product.image.urls[size] || product.image.urls.regular || product.image.urls.full);
  }

  function variantPrice(variant) {
    if (variant.price && typeof variant.price.display === "string") return variant.price.display;
    if (typeof variant.price === "string") return variant.price;
    return "DM for price";
  }

  function uniquePhotos(photos) {
    var seen = {};
    return photos.filter(function (photo) {
      var raw = (photo.raw || photo.url || "").split("?")[0];
      var photoPath = raw.match(/photo-[^/?#]+/);
      var keys = [
        photo.id ? "id:" + photo.id : "",
        photoPath ? "photo:" + photoPath[0] : "",
        raw ? "raw:" + raw : ""
      ].filter(Boolean);
      var duplicate = keys.some(function (key) { return seen[key]; });
      keys.forEach(function (key) { seen[key] = true; });
      return !duplicate;
    });
  }

  function photoToProduct(photo, index) {
    var raw = photo.raw || photo.url || photo.urls && (photo.urls.raw || photo.urls.full || photo.urls.regular);
    var name = "print-" + String(index + 1).padStart(2, "0");
    return {
      id: photo.id || name,
      slug: name,
      title: "Uncanny Stranger Print " + String(index + 1).padStart(2, "0"),
      description: photo.description || photo.alt_description || "Select print options, then request a manual invoice to confirm payment and delivery.",
      image: {
        alt: photo.alt || photo.alt_description || photo.description || "Uncanny Stranger print " + String(index + 1).padStart(2, "0"),
        urls: {
          thumb: unsplashUrl(raw, 240, 78),
          regular: unsplashUrl(raw, 900, 82),
          full: unsplashUrl(raw, 1800, 85)
        }
      },
      variants: DEFAULT_SIZES
    };
  }

  function localProducts() {
    return uniquePhotos(siteImages).map(photoToProduct);
  }

  function normalizeRemoteProducts(products) {
    return products.map(function (product, index) {
      var image = product.image || {};
      var urls = image.urls || {};
      var raw = urls.raw || urls.full || urls.regular;
      return {
        id: product.id || "remote-" + index,
        slug: product.slug || "print-" + String(index + 1).padStart(2, "0"),
        title: product.title || "Uncanny Stranger Print " + String(index + 1).padStart(2, "0"),
        description: product.description || "Select print options, then request a manual invoice to confirm payment and delivery.",
        image: {
          alt: image.alt || product.title || "Uncanny Stranger print",
          urls: {
            thumb: urls.thumb || unsplashUrl(raw, 240, 78),
            regular: urls.regular || unsplashUrl(raw, 900, 82),
            full: urls.full || unsplashUrl(raw, 1800, 85)
          }
        },
        variants: product.variants && product.variants.length ? product.variants : DEFAULT_SIZES
      };
    });
  }

  function photosFromPayload(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.photos)) return payload.photos;
    if (Array.isArray(payload.images)) return payload.images;
    if (Array.isArray(payload.results)) return payload.results;
    if (payload && payload.data) return photosFromPayload(payload.data);
    return [];
  }

  async function loadUnsplashProducts() {
    if (!ENABLE_REMOTE_UNSPLASH || !UNSPLASH_ENDPOINT) return [];
    var url = UNSPLASH_ENDPOINT + "?username=uncannystranger&limit=24";
    try {
      var response = await fetch(url, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Unsplash cache request failed");
      var payload = await response.json();
      return uniquePhotos(photosFromPayload(payload)).map(photoToProduct);
    } catch (error) {
      console.warn("[uncannystranger] Unsplash cache unavailable:", error.message);
      return [];
    }
  }

  async function loadCatalogProducts() {
    if (!ENABLE_REMOTE_CATALOG || !CATALOG_ENDPOINT) return [];
    try {
      var response = await fetch(CATALOG_ENDPOINT, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Catalog request failed");
      var payload = await response.json();
      var products = Array.isArray(payload.products) ? normalizeRemoteProducts(payload.products) : [];
      return products;
    } catch (error) {
      console.warn("[uncannystranger] Prints catalog unavailable:", error.message);
      return [];
    }
  }

  async function loadCatalog() {
    var unsplashProducts = await loadUnsplashProducts();
    if (unsplashProducts.length) return unsplashProducts;
    var catalogProducts = await loadCatalogProducts();
    return catalogProducts.length ? catalogProducts : localProducts();
  }

  function selectedPriceText() {
    var size = by('[data-purchase-panel] select[name="printSize"]');
    if (!size) return "DM for price";
    return size.options[size.selectedIndex].getAttribute("data-print-price") || "DM for price";
  }

  function renderCart() {
    var lines = by("[data-print-cart]");
    var total = by("[data-print-total]");
    var count = by("[data-print-cart-count]");
    if (count) count.textContent = String(state.cart.reduce(function (sum, item) { return sum + item.quantity; }, 0));
    if (!lines || !total) return;
    if (!state.cart.length) {
      lines.innerHTML = '<p class="udr-cart-empty">Your cart is empty.</p>';
      total.textContent = "DM for price";
      return;
    }
    lines.innerHTML = state.cart.map(function (item, index) {
      return [
        '<div class="udr-cart-line">',
        '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '" loading="lazy" decoding="async">',
        '<div class="udr-cart-line__meta">',
        '<strong>' + escapeHtml(item.material) + '</strong>',
        '<span>' + escapeHtml(item.size) + '</span>',
        '<span>' + escapeHtml(item.border) + '</span>',
        '<button type="button" data-print-remove="' + index + '">Remove</button>',
        '</div>',
        '<div class="udr-cart-line__side">',
        '<strong>' + escapeHtml(item.price) + '</strong>',
        '<div class="udr-qty" aria-label="Quantity">',
        '<button type="button" data-print-qty="' + index + '" data-print-qty-dir="-1">-</button>',
        '<span>' + escapeHtml(item.quantity) + '</span>',
        '<button type="button" data-print-qty="' + index + '" data-print-qty-dir="1">+</button>',
        '</div>',
        '</div>',
        '</div>'
      ].join("");
    }).join("");
    total.textContent = state.cart[state.cart.length - 1].price || "DM for price";
  }

  function openCart() {
    var drawer = by("[data-print-cart-drawer]");
    var toggle = by("[data-print-cart-toggle]");
    if (drawer) {
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
    }
    if (toggle) toggle.setAttribute("aria-expanded", "true");
  }

  function closeCart() {
    var drawer = by("[data-print-cart-drawer]");
    var toggle = by("[data-print-cart-toggle]");
    if (drawer) {
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
    }
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function selectMarkup(name, values, selectedValue) {
    return values.map(function (value) {
      var label = typeof value === "string" ? value : value.label;
      var price = typeof value === "string" ? "" : variantPrice(value);
      return '<option value="' + escapeHtml(label) + '"' + (price ? ' data-print-price="' + escapeHtml(price) + '"' : "") + (label === selectedValue ? " selected" : "") + '>' + escapeHtml(label) + '</option>';
    }).join("");
  }

  function renderProduct(product) {
    var detail = by("[data-print-detail]");
    if (!detail || !product) return;
    state.selected = product;
    var firstVariant = product.variants && product.variants[0] ? product.variants[0] : DEFAULT_SIZES[0];
    detail.hidden = false;
    detail.innerHTML = [
      '<div class="udr-product-shell">',
      '<a class="udr-back" href="/pages/prints/index.html#prints-catalog" data-print-back>Back to Gallery</a>',
      '<button class="udr-share" type="button" data-print-share aria-label="Share print">Share</button>',
      '<div class="udr-product-image"><img src="' + escapeHtml(imageUrl(product, "full")) + '" alt="' + escapeHtml(product.image.alt || product.title) + '"></div>',
      '<aside class="udr-options">',
      '<form class="udr-purchase-panel" data-purchase-panel>',
      '<label>Material<select name="material">' + selectMarkup("material", MATERIALS, MATERIALS[0]) + '</select></label>',
      '<label>Size <span>(inches)</span><div class="udr-size-row"><select name="printSize">' + selectMarkup("printSize", product.variants || DEFAULT_SIZES, firstVariant.label) + '</select><span class="udr-unit-toggle"><button type="button" class="is-active" data-print-unit="in">in</button><button type="button" data-print-unit="cm">cm</button></span></div></label>',
      '<label>Border<select name="border">' + selectMarkup("border", BORDERS, BORDERS[0]) + '</select></label>',
      '<button class="udr-add-cart" type="button" data-add-to-cart><span>Add To Cart</span><strong data-selected-price>' + escapeHtml(variantPrice(firstVariant)) + '</strong></button>',
      '</form>',
      '<div class="udr-accordion"><button type="button" data-accordion-toggle>Specifications <span>-</span></button><ul><li>Professional archival print materials</li><li>Non-reflective surface with rich color depth</li><li>Manual invoice and delivery confirmation</li><li>White borders do not change print size</li></ul></div>',
      '<div class="udr-accordion is-closed"><button type="button" data-accordion-toggle>Delivery & Returns <span>+</span></button><p hidden>Delivery timing and return details are confirmed manually with the invoice.</p></div>',
      '</aside>',
      '</div>'
    ].join("");
    detail.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderCatalog() {
    var grid = by("[data-print-grid]");
    if (!grid) return;
    grid.innerHTML = "";
    state.products.forEach(function (product) {
      var card = document.createElement("button");
      card.className = "udr-print-card";
      card.type = "button";
      card.setAttribute("data-print-open", product.slug);
      card.setAttribute("aria-label", "View " + product.title);
      card.innerHTML = [
        '<img src="' + escapeHtml(imageUrl(product, "regular")) + '" alt="' + escapeHtml(product.image.alt || product.title) + '" loading="lazy" decoding="async">',
        '<div class="udr-print-card__overlay">',
        "<h3>" + escapeHtml(product.title) + "</h3>",
        "<span>View print</span>",
        "</div>"
      ].join("");
      grid.appendChild(card);
    });
  }

  function addSelectedToCart(panel) {
    var product = state.selected;
    if (!product || !panel) return;
    var material = panel.querySelector('select[name="material"]');
    var size = panel.querySelector('select[name="printSize"]');
    var border = panel.querySelector('select[name="border"]');
    state.cart = [{
      title: product.title,
      image: imageUrl(product, "thumb") || imageUrl(product, "regular"),
      material: material ? material.value : MATERIALS[0],
      size: size ? size.value : DEFAULT_SIZES[0].label,
      border: border ? border.value : BORDERS[0],
      quantity: 1,
      price: selectedPriceText()
    }];
    renderCart();
    openCart();
  }

  function bindEvents() {
    document.addEventListener("click", function (event) {
      var open = event.target.closest("[data-print-open]");
      if (open) {
        event.preventDefault();
        var product = state.products.find(function (candidate) { return candidate.slug === open.getAttribute("data-print-open"); });
        if (product && window.history && window.history.pushState) {
          window.history.pushState(null, "", "/pages/prints/index.html?print=" + encodeURIComponent(product.slug));
        }
        renderProduct(product);
      }

      if (event.target.closest("[data-print-cart-toggle]")) {
        event.preventDefault();
        openCart();
      }

      if (event.target.closest("[data-print-cart-close]")) {
        event.preventDefault();
        closeCart();
      }

      var remove = event.target.closest("[data-print-remove]");
      if (remove) {
        event.preventDefault();
        state.cart.splice(Number(remove.getAttribute("data-print-remove")), 1);
        renderCart();
      }

      var qty = event.target.closest("[data-print-qty]");
      if (qty) {
        event.preventDefault();
        var item = state.cart[Number(qty.getAttribute("data-print-qty"))];
        if (!item) return;
        item.quantity = Math.max(1, item.quantity + Number(qty.getAttribute("data-print-qty-dir")));
        renderCart();
      }

      if (event.target.closest("[data-add-to-cart]")) {
        event.preventDefault();
        addSelectedToCart(event.target.closest("[data-purchase-panel]"));
      }

      if (event.target.closest("[data-print-unit]")) {
        event.preventDefault();
        var group = event.target.closest(".udr-unit-toggle");
        if (group) {
          group.querySelectorAll("button").forEach(function (button) { button.classList.remove("is-active"); });
          event.target.classList.add("is-active");
        }
      }

      var accordion = event.target.closest("[data-accordion-toggle]");
      if (accordion) {
        event.preventDefault();
        var panel = accordion.closest(".udr-accordion");
        var closed = panel.classList.toggle("is-closed");
        var content = panel.querySelector("ul, p");
        var symbol = accordion.querySelector("span");
        if (content) content.hidden = closed;
        if (symbol) symbol.textContent = closed ? "+" : "-";
      }

      var back = event.target.closest("[data-print-back]");
      if (back) {
        var detail = by("[data-print-detail]");
        if (detail) detail.hidden = true;
        state.selected = null;
      }

      if (event.target.closest("[data-print-share]")) {
        event.preventDefault();
        if (navigator.share && state.selected) {
          navigator.share({ title: state.selected.title, url: window.location.href }).catch(function () {});
        }
      }
    });

    document.addEventListener("change", function (event) {
      if (!event.target.matches('select[name="printSize"]')) return;
      var selectedPrice = by("[data-selected-price]");
      if (selectedPrice) selectedPrice.textContent = selectedPriceText();
    });
  }

  async function init() {
    bindEvents();
    renderCart();
    state.products = await loadCatalog();
    renderCatalog();
    var requested = new URLSearchParams(window.location.search).get("print");
    if (requested) {
      var product = state.products.find(function (candidate) { return candidate.slug === requested; });
      if (product) renderProduct(product);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}());
