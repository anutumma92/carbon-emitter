/* global OpenLayersTilesSource ol */
app.registerModule('maps', function () {
    var config = {
        earthRadius: 6371000, // meters
        snapMaxDistance: 100000,
        selector: {
            directions: '#route-map',
            toolTip: '#tooltip-current',
        }
    };

    var defaultMapOptions = {
        controls: {
            Zoom: true,
        },
        interactions: {
            DragRotate: true,
            DoubleClickZoom: true,
            PinchRotate: true,
            PinchZoom: true,
            KeyboardPan: true,
            KeyboardZoom: true,
            DragZoom: true,
            MouseWheelZoom: true,
            DragPan: true,
        },
    };

    function rad(deg) {
        return deg * Math.PI / 180;
    }

    /**
     * https://epsg.io/4326 - this standard is used in GPS,
     * and HERE provider return us coordinates in EPSG:4326 during address resolving
     *
     * https://epsg.io/3857 - this standard is used in OpenLayers by default
     *
     * f.e. for Berlin:
     * transformPoint([13.424755, 52.507208]) === [1494436.89, 6892359.91]
     *
     * @param point Array
     * @return Array
     */
    function transformPoint(point) {
        return ol.proj.transform(point, 'EPSG:4326', 'EPSG:3857');
    }

    function distance(p1, p2) {
        var lat1 = rad(p1[1]),
            lat2 = rad(p2[1]),
            lng1 = rad(p1[0]),
            lng2 = rad(p2[0]);

        var x = (lng2 - lng1) * Math.cos((lat1 + lat2) / 2);
        var y = lat2 - lat1;

        return Math.sqrt(x * x + y * y) * config.earthRadius;
    }

    function getElementOptions(element, key) {
        var optionAttribute = element.getAttribute('data-' + key);
        var options = null;

        if (optionAttribute === 'false') {
            return false;
        }

        if (optionAttribute) {
            try {
                options = JSON.parse(optionAttribute);
            } catch (e) {
                options = {};
            }
        }

        return defaultMapOptions[key] ? $.extend(defaultMapOptions[key], options) : options;
    }

    function getMapOptions(element, key, callback) {
        var options = getElementOptions(element, key);
        var collection = new ol.Collection();

        if (!options) {
            return collection;
        }

        for (var option in options) {
            if (!Object.prototype.hasOwnProperty.call(options, option)) {
                continue;
            }

            if (options[option] === true || typeof options[option] === 'object') {
                var result = callback(option, typeof options[option] === 'object' ? options[option] : {});
                if (result) {
                    collection.push(result);
                }
            }
        }

        return collection;
    }

    function route(element) {
        var viewOptions = {
            zoom: 6,
        };

        if (element.getAttribute('data-center')) {
            viewOptions.center = ol.proj.fromLonLat(JSON.parse((element.getAttribute('data-center'))));
        }

        var map = new ol.Map({
            target: element,
            layers: [
                new ol.layer.Tile({
                    preload: Infinity,
                    source: OpenLayersTilesSource
                }),
            ],
            view: new ol.View(viewOptions),
            controls: getMapOptions(element, 'controls', function (key, options) {
                if (!ol.control[key]) {
                    return false;
                }

                return new ol.control[key](options);
            }),
            interactions: getMapOptions(element, 'interactions', function (key, options) {
                if (!ol.interaction[key]) {
                    return false;
                }

                return new ol.interaction[key](options);
            }),
        });

        var features = {};
        var collection = new ol.Collection();

        function prepareRoutes() {
            function prepareRoute(name) {
                if (features[name]) {
                    collection.remove(features[name]);
                }

                var route = decodeRoute(element.getAttribute('data-' + name) || ''),
                    points = [];

                for (var i = 0; i < route.length; i++) {
                    points.push(transformPoint(route[i]));
                }

                features[name] = new ol.Feature(new ol.geom.LineString(points));
                collection.push(features[name])
            }

            prepareRoute('route');
            prepareRoute('actual-route');
        }

        prepareRoutes();

        if (element.getAttribute('data-current')) {
            var current = JSON.parse(element.getAttribute('data-current'));
            features.icon = element.getAttribute('data-icon') || '/img/content/marker-current.png';

            if (element.getAttribute('data-snap')) {
                var closest;

                for (var i = 0; i < route.length; i++) {
                    var diff = distance(current, route[i]);
                    if (diff <= config.snapMaxDistance && (!closest || closest.diff > diff)) {
                        closest = {
                            point: route[i],
                            diff: diff
                        };
                    }
                }

                if (closest) {
                    features.current = new ol.Feature({
                        geometry: new ol.geom.Point(transformPoint(closest.point))
                    });
                    collection.push(features.current);
                }
            } else {
                features.current = new ol.Feature({
                    geometry: new ol.geom.Point(transformPoint(current)),
                });
                collection.push(features.current);
            }
        }

        var source = new ol.source.Vector({features: collection, wrapX: false});

        var layer = new ol.layer.Vector({
            source: source,
            style: function () {
                var styles = [];

                function styleRoute(name, color) {
                    if (element.getAttribute('data-hideLine') === 'true') {
                        return;
                    }

                    if (features[name].getGeometry().getCoordinates().length > 2) {
                        styles.push(new ol.style.Style({
                            geometry: features[name].getGeometry(),
                            stroke: new ol.style.Stroke({
                                color: color,
                                width: 4
                            })
                        }));
                    }
                }

                styleRoute('route', 'rgba(230, 59, 9, 0.6)');
                styleRoute('actual-route', '#4E8BAD');

                if (element.getAttribute('data-stops')) {
                    var stops = [];
                    try {
                        stops = JSON.parse(element.getAttribute('data-stops'));
                    } catch (e) {
                        console.error(e);
                    }
                    stops.map(function(stop, key) {
                        var isLastStop = key === stops.length - 1;
                        var markerName = 'marker';

                        if (isLastStop) {
                            markerName += '-last';
                        }

                        if (stop.icon === 'visited' || stop.icon === 'current') {
                            markerName += '-visited';
                        }

                        var style = new ol.style.Style({
                            geometry: new ol.geom.Point(transformPoint(stop.point)),
                            image: new ol.style.Icon({
                                src: '/img/content/' + markerName + '.png',
                                anchor: [0.5, 0.5],
                                scale: 0.5
                            })
                        });

                        if (!isLastStop) {
                            style.setText(new ol.style.Text({
                                text: (key+1).toString(),
                                font: 'normal 8px "Avenir Bold", Helvetica, Arial, sans-serif',
                                scale: 1.5,
                                fill: new ol.style.Fill({
                                    color: '#ffffff'
                                }),
                                offsetY: -2,
                            }))
                        }

                        styles.push(style);
                    })
                } else {
                    styles.push(
                        new ol.style.Style({
                            geometry: new ol.geom.Point(features.route.getGeometry().getFirstCoordinate()),
                            image: new ol.style.Icon({
                                src: '/img/content/pickup-marker.png',
                                anchor: [0.5, 0.5],
                                scale: 0.5
                            })
                        }),
                        new ol.style.Style({
                            geometry: new ol.geom.Point(features.route.getGeometry().getLastCoordinate()),
                            image: new ol.style.Icon({
                                src: '/img/content/drop-off-marker.png',
                                anchor: [0.5, 0.5],
                                scale: 0.5
                            })
                        })
                    );
                }

                if (features.current) {
                    styles.push(new ol.style.Style({
                        geometry: new ol.geom.Point(features.current.getGeometry().getFirstCoordinate()),
                        image: new ol.style.Icon({
                            src: features.icon,
                            anchor: [0.5, 0.5],
                            scale: 0.4
                        })
                    }))
                }

                return styles;
            }
        });

        if (element.getAttribute('data-render-mode')) {
            layer.set('renderMode', element.getAttribute('data-render-mode'));
        }

        map.addLayer(layer);

        function scaleMap() {
            if (features.route.getGeometry().getCoordinates().length > 0) {
                map.getView().fit(source.getExtent(), {
                    padding: [50, 50, 50, 50],
                    maxZoom: 16
                });
            }
        }

        scaleMap();

        var tooltipInfo = $(config.selector.toolTip);
        if (tooltipInfo.length) {
            tooltipInfo.tooltip({
                animation: false,
                trigger: 'manual',
                html: true,
                template:
                    '<div class="tooltip tooltip-map" role="tooltip">' +
                    '<div class="tooltip-arrow"></div>' +
                    '<div class="tooltip-inner"></div>' +
                    '</div>',
            });

            var displayFeatureInfo = function (pixel) {
                tooltipInfo.css({
                    left: pixel[0] + 'px',
                    top: pixel[1] - 15 + 'px',
                });

                var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
                    return feature.getGeometry() === features.current.getGeometry() ? feature : null;
                });

                if (feature) {
                    tooltipInfo.tooltip('show');
                } else {
                    tooltipInfo.tooltip('hide');
                }
            };

            map.on('pointermove', function (evt) {
                if (evt.dragging) {
                    tooltipInfo.tooltip('hide');
                    return;
                }
                displayFeatureInfo(map.getEventPixel(evt.originalEvent));
            });
        }

        return {
            map: map,
            update: function () {
                prepareRoutes();
                layer.getSource().changed();
                scaleMap();
            }
        };
    }

    function decodeRoute(encoded) {
        var len = encoded.length;
        var index = 0;
        var array = [];
        var lat = 0;
        var lng = 0;

        while (index < len) {
            var b;
            var shift = 0;
            var result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += deltaLat;

            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var deltaLon = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += deltaLon;

            array.push([lng * 1e-5, lat * 1e-5]);
        }

        return array;
    }

    return {
        init: function () {
            $(config.selector.directions).each(function () {
                route(this);
            });
        },
        route: route,
        decodeRoute: decodeRoute
    }
});
