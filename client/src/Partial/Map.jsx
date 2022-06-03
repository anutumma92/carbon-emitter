/* global app */
import React from 'react';

export default class extends React.Component {
  routeHandler = null;

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    this.routeHandler = app.getModule('maps').module.route(this.mapRef.current);
  }

  componentDidUpdate() {
    this.routeHandler.update();
  }

  componentWillUnmount() {
    this.unbindScroll();
  }

  unbindScroll() {
    window.removeEventListener('scroll', this.onWindowScroll);
  }

  render() {
    const {
      className = 'route',
      center,
      route,
      actualRoute,
      current,
      icon,
      controls,
      interactions,
      stops,
      hideLine,
      renderMode,
      customControls,
      currentTooltip,
    } = this.props;

    return (
      <>
        <div
          id="route-map"
          className={className}
          ref={this.mapRef}
          data-center={center && JSON.stringify([center.lng, center.lat])}
          data-route={route}
          data-actual-route={actualRoute}
          data-stops={stops && JSON.stringify(stops.map((stop) => ({
            icon: stop.flag,
            point: [
              stop.address.location ? stop.address.location.lng : '',
              stop.address.location ? stop.address.location.lat : '',
            ],
          })))}
          data-current={current && JSON.stringify([current.lng, current.lat])}
          data-icon={icon}
          data-controls={controls && JSON.stringify(controls)}
          data-interactions={interactions && JSON.stringify(interactions)}
          data-hideline={hideLine}
          data-render-mode={renderMode}
        >
          {customControls && (
            <div className="ol-unselectable ol-control ol-overlaycontainer-stopevent ol-overlay">
              {customControls}
            </div>
          )}
          {currentTooltip && (<div id="tooltip-current" data-original-title={currentTooltip} />)}
        </div>
      </>
    );
  }
}
