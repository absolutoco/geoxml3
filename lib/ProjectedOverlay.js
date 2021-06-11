/*
 * Copyright (C) 2009 John D. Coryat
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

/**
 * Create an overlay on the map from a projected image - Maps v3...
 *
 * @param map This Map
 * @param imageUrl URL of the image (Mandatory)
 * @param bounds Bounds object of image destination (Mandatory)
 * @param opts Options
 * @param opts.addZoom Added Zoom factor as a parameter to the imageUrl (include complete parameter, including separater like '?zoom='
 * @param opts.id Default imageUrl, ID of the div
 * @param opts.percentOpacity Default 50, percent opacity to use when the image is loaded 0-100.
 * @param opts.rotation default 0, degrees clockwise to rotate the image
 * @constructor
 */
function ProjectedOverlay(map, imageUrl, bounds, opts) {
  window.google.maps.OverlayView.call(this);

  this.active = false;
  this.map_ = map;
  this.url_ = imageUrl;
  /**
   * @var window.google.maps.LatLngBounds
   * @param window.google.maps.LatLngBounds.getSouthWest
   * @param window.google.maps.LatLngBounds.getNorthEast
   * @private
   */
  this.bounds_ = bounds;
  /**
   * Add the zoom to the image as a parameter
   *
   * @var {string}
   * @private
   */
  this.addZ_ = opts.addZoom || '';
  /**
   * Added to allow for multiple images
   *
   * @var {string}
   * @private
   */
  this.id_ = opts.id || this.url_;
  this.percentOpacity_ = opts.percentOpacity || 50;
  this.rotation_ = opts.rotation || 0;
  this.setMap(map);
}

ProjectedOverlay.prototype = new window.google.maps.OverlayView();

ProjectedOverlay.prototype.createElement = function () {
  var panes = this.getPanes();
  var div = this.div_;

  if (!div) {
    div = this.div_ = document.createElement("div");
    div.style.position = "absolute";
    div.setAttribute('id', this.id_);
    this.div_ = div;
    this.lastZoom_ = -1;
    if (this.percentOpacity_) {
      this.setOpacity(this.percentOpacity_);
    }
    if (this.rotation_) {
      this.setRotation(this.rotation_);
    }
    panes.overlayLayer.appendChild(div);
  }
};

/**
 * Remove the main DIV from the map pane
 */
ProjectedOverlay.prototype.remove = function () {
  if (this.div_) {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
    this.setMap(null);
  }
};

/**
 * Redraw based on the current projection and zoom level
 */
ProjectedOverlay.prototype.draw = function () {
  // Creates the element if it doesn't exist already.

  this.createElement();

  if (!this.div_) {
    return;
  }

  /**
   * @var window.google.maps.OverlayView projection
   * @var window.google.maps.OverlayView.fromLatLngToDivPixel projection
   */
  var projection = this.get('projection'),
    c1 = projection.fromLatLngToDivPixel(this.bounds_.getSouthWest()),
    c2 = projection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

  if (!c1 || !c2) return;

  // Now position our DIV based on the DIV coordinates of our bounds

  this.div_.style.width = Math.abs(c2.x - c1.x) + "px";
  this.div_.style.height = Math.abs(c2.y - c1.y) + "px";
  this.div_.style.left = Math.min(c2.x, c1.x) + "px";
  this.div_.style.top = Math.min(c2.y, c1.y) + "px";

  var url = this.url_;

  if (this.addZ_) {
    url += this.addZ_ + this.map_.getZoom();
  }

  this.div_.innerHTML = '<img src="' + url + '"  width=' + this.div_.style.width + ' height=' + this.div_.style.height + ' >';

  // Do the rest only if the zoom has changed...

  if (this.lastZoom_ === this.map_.getZoom()) {
    return;
  }

  this.lastZoom_ = this.map_.getZoom();
};

ProjectedOverlay.prototype.setOpacity = function (opacity) {
  if (opacity < 0) {
    opacity = 0;
  }
  if (opacity > 100) {
    opacity = 100;
  }
  var c = opacity / 100;

  if (typeof(this.div_.style.filter) === 'string') {
    this.div_.style.filter = 'alpha(opacity:' + opacity + ')';
  }
  if (typeof(this.div_.style.KHTMLOpacity) === 'string') {
    this.div_.style.KHTMLOpacity = c;
  }
  if (typeof(this.div_.style.MozOpacity) === 'string') {
    this.div_.style.MozOpacity = c;
  }
  if (typeof(this.div_.style.opacity) === 'string') {
    this.div_.style.opacity = c;
  }
};

ProjectedOverlay.prototype.setRotation = function (deg) {
  this.div_.style.webkitTransform = 'rotate(' + deg + 'deg)';
  this.div_.style.mozTransform = 'rotate(' + deg + 'deg)';
  this.div_.style.msTransform = 'rotate(' + deg + 'deg)';
  this.div_.style.oTransform = 'rotate(' + deg + 'deg)';
  this.div_.style.transform = 'rotate(' + deg + 'deg)';
};
