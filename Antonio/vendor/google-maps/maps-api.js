(function () {
  function LatLng(lat, lng) {
    this.lat = function () { return lat; };
    this.lng = function () { return lng; };
  }

  function Map(element, settings) {
    this.element = element;
    this.center = settings && settings.center;
    this.mapTypes = { set: function () {} };
    this.setMapTypeId = function () {};
    this.getCenter = function () { return this.center; };
    this.setCenter = function (center) { this.center = center; };

    if (element) {
      element.classList.add("local-google-map");
      element.innerHTML = '<div class="local-google-map__grid"></div><img class="local-google-map__marker" src="images/marker.png" alt="">';
    }
  }

  function Marker(options) {
    this.options = options || {};
  }

  function InfoWindow(options) {
    this.options = options || {};
    this.open = function () {};
  }

  window.google = window.google || {};
  window.google.maps = {
    LatLng: LatLng,
    Map: Map,
    StyledMapType: function () {},
    MarkerImage: function (url) { this.url = url; },
    Size: function (width, height) { this.width = width; this.height = height; },
    Point: function (x, y) { this.x = x; this.y = y; },
    Marker: Marker,
    InfoWindow: InfoWindow,
    MapTypeId: { ROADMAP: "roadmap" },
    event: {
      addDomListener: function (target, type, handler) {
        target.addEventListener(type, handler);
      },
      addListener: function () {},
      trigger: function () {}
    }
  };
})();
