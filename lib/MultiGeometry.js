/**
 * A MultiGeometry object that will allow multiple polylines in a MultiGeometry
 * containing LineStrings to be treated as a single object
 *
 * @param {array} multiGeometryOptions anonymous object. Available properties:
 *  map: The map on which to attach the MultiGeometry
 *  paths: the individual polylines
 *  polylineOptions: options to use when constructing all the polylines
 *
 * @constructor
 */
function MultiGeometry(multiGeometryOptions) {
  function createPolyline(polylineOptions, mg) {
    var polyline = new window.google.maps.Polyline(polylineOptions);
    window.google.maps.event.addListener(polyline, 'click', function (evt) {
      window.google.maps.event.trigger(mg, 'click', evt);
    });
    window.google.maps.event.addListener(polyline, 'dblclick', function (evt) {
      window.google.maps.event.trigger(mg, 'dblclick', evt);
    });
    window.google.maps.event.addListener(polyline, 'mousedown', function (evt) {
      window.google.maps.event.trigger(mg, 'mousedown', evt);
    });
    window.google.maps.event.addListener(polyline, 'mousemove', function (evt) {
      window.google.maps.event.trigger(mg, 'mousemove', evt);
    });
    window.google.maps.event.addListener(polyline, 'mouseout', function (evt) {
      window.google.maps.event.trigger(mg, 'mouseout', evt);
    });
    window.google.maps.event.addListener(polyline, 'mouseover', function (evt) {
      window.google.maps.event.trigger(mg, 'mouseover', evt);
    });
    window.google.maps.event.addListener(polyline, 'mouseup', function (evt) {
      window.google.maps.event.trigger(mg, 'mouseup', evt);
    });
    window.google.maps.event.addListener(polyline, 'rightclick', function (evt) {
      window.google.maps.event.trigger(mg, 'rightclick', evt);
    });
    return polyline;
  }

  this.setValues(multiGeometryOptions);
  this.polylines = [];
  this.paths = [];

  for (var i = 0; i < this.paths.length; i++) {
    var polylineOptions = multiGeometryOptions;
    polylineOptions.path = this.paths[i];
    var polyline = createPolyline(polylineOptions, this);
    // Bind the polyline properties to the MultiGeometry properties
    this.polylines.push(polyline);
  }
}

MultiGeometry.prototype = new window.google.maps.MVCObject();

MultiGeometry.prototype.changed = function (key) {
  if (this.polylines) {
    for (var i = 0; i < this.polylines.length; i++) {
      this.polylines[i].set(key, this.get(key));
    }
  }
};

MultiGeometry.prototype.setMap = function (map) {
  this.set('map', map);
};

MultiGeometry.prototype.getMap = function () {
  return this.get('map');
};

module.exports = MultiGeometry;
